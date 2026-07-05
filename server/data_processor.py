# """
# Data Processing Engine
# Handles data ingestion, transformation, and feature engineering
# """
# import pandas as pd
# import numpy as np
# from datetime import datetime, timedelta
# from typing import Dict, List, Any, Optional
# import os

# class DataEngine:
#     def __init__(self):
#         self.raw_data = None
#         self.processed_data = None
#         self.feature_columns = ['AC_BR_kW', 'AC_DR_kW', 'UPS_kW', 'LR_kW', 'Kitchen_kW', 'AC_Dr_kW']
#         self.load_data()
    
#     def load_data(self):
#         """Load and cache data"""
#         try:
#             data_path = os.path.join('..', 'data', 'Electricity_cleaned.csv')
#             self.raw_data = pd.read_csv(data_path, parse_dates=['Date_Time'])
#             self.raw_data.set_index('Date_Time', inplace=True)
#             self._preprocess_data()
#         except Exception as e:
#             print(f"Data loading error: {e}")
    
#     def _preprocess_data(self):
#         """Preprocess raw data"""
#         if self.raw_data is None:
#             return
        
#         # Create time-based features
#         self.raw_data['hour'] = self.raw_data.index.hour
#         self.raw_data['day_of_week'] = self.raw_data.index.dayofweek
#         self.raw_data['is_weekend'] = self.raw_data['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
#         self.raw_data['month'] = self.raw_data.index.month
        
#         # Create lag features
#         for col in self.feature_columns:
#             self.raw_data[f'{col}_lag_1'] = self.raw_data[col].shift(1)
#             self.raw_data[f'{col}_lag_24'] = self.raw_data[col].shift(24)
        
#         # Create rolling statistics
#         for col in self.feature_columns:
#             self.raw_data[f'{col}_rolling_mean_24'] = self.raw_data[col].rolling(window=24).mean()
#             self.raw_data[f'{col}_rolling_std_24'] = self.raw_data[col].rolling(window=24).std()
        
#         self.processed_data = self.raw_data.dropna()
    
#     def generate_features(self, timestamp: datetime) -> Dict[str, float]:
#         """Generate features for a given timestamp"""
#         features = {
#             'hour': timestamp.hour,
#             'day_of_week': timestamp.weekday(),
#             'is_weekend': 1 if timestamp.weekday() >= 5 else 0,
#             'month': timestamp.month,
#             'time_sin': np.sin(2 * np.pi * timestamp.hour / 24),
#             'time_cos': np.cos(2 * np.pi * timestamp.hour / 24)
#         }
        
#         # Add seasonal features
#         features['season'] = self._get_season(timestamp.month)
#         features['is_peak_hour'] = 1 if 17 <= timestamp.hour <= 21 else 0
        
#         return features
    
#     def _get_season(self, month: int) -> int:
#         """Convert month to season (1: winter, 2: spring, 3: summer, 4: fall)"""
#         if month in [12, 1, 2]:
#             return 1  # Winter
#         elif month in [3, 4, 5]:
#             return 2  # Spring
#         elif month in [6, 7, 8]:
#             return 3  # Summer
#         else:
#             return 4  # Fall
    
#     def get_historical_data(self, days: int = 30, resolution: str = 'hourly') -> Dict[str, Any]:
#         """Get historical data with specified resolution"""
#         if self.processed_data is None:
#             return {}
        
#         end_date = datetime.now()
#         start_date = end_date - timedelta(days=days)
        
#         mask = (self.processed_data.index >= start_date) & (self.processed_data.index <= end_date)
#         historical = self.processed_data.loc[mask].copy()
        
#         if resolution == 'daily':
#             historical = historical.resample('D').mean()
#         elif resolution == 'weekly':
#             historical = historical.resample('W').mean()
        
#         return historical.to_dict('records')
    
#     def analyze_historical(self, data: List[Dict]) -> Dict[str, Any]:
#         """Analyze historical data"""
#         if not data:
#             return {}
        
#         df = pd.DataFrame(data)
        
#         return {
#             "statistics": {
#                 "mean_consumption": float(df['Usage_kW'].mean()),
#                 "max_consumption": float(df['Usage_kW'].max()),
#                 "min_consumption": float(df['Usage_kW'].min()),
#                 "std_consumption": float(df['Usage_kW'].std())
#             },
#             "patterns": {
#                 "daily_pattern": self._extract_daily_pattern(df),
#                 "weekly_pattern": self._extract_weekly_pattern(df),
#                 "peak_hours": self._identify_peak_hours(df)
#             }
#         }
    
#     def _extract_daily_pattern(self, df: pd.DataFrame) -> Dict[int, float]:
#         """Extract daily consumption pattern"""
#         if 'hour' not in df.columns:
#             return {}
        
#         pattern = {}
#         for hour in range(24):
#             hour_data = df[df['hour'] == hour]['Usage_kW']
#             if not hour_data.empty:
#                 pattern[hour] = float(hour_data.mean())
        
#         return pattern
    
#     def _extract_weekly_pattern(self, df: pd.DataFrame) -> Dict[int, float]:
#         """Extract weekly consumption pattern"""
#         if 'day_of_week' not in df.columns:
#             return {}
        
#         pattern = {}
#         for day in range(7):
#             day_data = df[df['day_of_week'] == day]['Usage_kW']
#             if not day_data.empty:
#                 pattern[day] = float(day_data.mean())
        
#         return pattern
    
#     def _identify_peak_hours(self, df: pd.DataFrame) -> List[Dict]:
#         """Identify peak consumption hours"""
#         if 'hour' not in df.columns:
#             return []
        
#         hourly_avg = df.groupby('hour')['Usage_kW'].mean()
#         top_hours = hourly_avg.nlargest(3)
        
#         return [
#             {"hour": int(hour), "consumption": float(consumption)}
#             for hour, consumption in top_hours.items()
#         ]
    



# Data Engine for handling electricity consumption data

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class DataEngine:
    """Data processing engine for electricity consumption"""
    
    def __init__(self, data_path=None):
        self.data_path = data_path
        self.data = None
        logger.info("✅ Data Engine initialized")
    
    def load_data(self, filepath=None):
        """Load data from CSV file with error handling"""
        try:
            filepath = filepath or self.data_path
            if not filepath:
                logger.warning("No data file path provided")
                return None
            
            # Try multiple encodings
            encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
            
            for encoding in encodings:
                try:
                    self.data = pd.read_csv(
                        filepath,
                        encoding=encoding,
                        on_bad_lines='skip',
                        low_memory=False
                    )
                    logger.info(f"Successfully loaded data with {encoding} encoding")
                    logger.info(f"Data shape: {self.data.shape}")
                    return self.data
                except Exception as e:
                    logger.debug(f"Failed with {encoding}: {e}")
                    continue
            
            logger.error("Failed to load data with all encodings")
            return None
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            return None
    
    def get_historical_data(self, days=30, resolution='hourly'):
        """Get historical consumption data"""
        try:
            # Simulated historical data
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            dates = []
            if resolution == 'hourly':
                hours = days * 24
                dates = [start_date + timedelta(hours=i) for i in range(hours)]
            elif resolution == 'daily':
                dates = [start_date + timedelta(days=i) for i in range(days)]
            
            # Generate simulated consumption data
            np.random.seed(42)
            base_consumption = 50
            data = []
            
            for date in dates:
                hour = date.hour
                day_of_week = date.weekday()
                
                # Add patterns
                hour_factor = 1.0 + 0.5 * np.sin(hour * np.pi / 12)
                weekday_factor = 1.0 if day_of_week < 5 else 0.7
                random_factor = np.random.uniform(0.9, 1.1)
                
                consumption = base_consumption * hour_factor * weekday_factor * random_factor
                
                data.append({
                    "timestamp": date.isoformat(),
                    "consumption_kwh": round(consumption, 2),
                    "hour": hour,
                    "day_of_week": day_of_week,
                    "is_weekend": 1 if day_of_week >= 5 else 0
                })
            
            return {
                "success": True,
                "period": f"{days} days",
                "resolution": resolution,
                "data_points": len(data),
                "data": data
            }
            
        except Exception as e:
            logger.error(f"Error getting historical data: {str(e)}")
            return {"error": str(e)}
    
    def analyze_historical(self, historical_data):
        """Analyze historical data"""
        try:
            if "data" not in historical_data:
                return {"error": "No data to analyze"}
            
            data = historical_data["data"]
            consumptions = [d["consumption_kwh"] for d in data]
            
            return {
                "average": round(np.mean(consumptions), 2),
                "median": round(np.median(consumptions), 2),
                "std_dev": round(np.std(consumptions), 2),
                "min": round(min(consumptions), 2),
                "max": round(max(consumptions), 2),
                "total": round(sum(consumptions), 2)
            }
        except Exception as e:
            return {"error": str(e)}