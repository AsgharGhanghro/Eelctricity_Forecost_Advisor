"""
Utility functions for AI Electricity Advisor
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import time
import json
import hashlib
from typing import Dict, List, Any, Optional
import warnings
warnings.filterwarnings('ignore')

class Cache:
    """Simple in-memory cache"""
    
    def __init__(self, ttl=300, max_size=1000):
        self.cache = {}
        self.ttl = ttl
        self.max_size = max_size
        self.hits = 0
        self.misses = 0
    
    def get(self, key):
        """Get item from cache"""
        if key in self.cache:
            item = self.cache[key]
            if time.time() - item['timestamp'] < self.ttl:
                self.hits += 1
                return item['data']
            else:
                del self.cache[key]
        self.misses += 1
        return None
    
    def set(self, key, data):
        """Set item in cache"""
        if len(self.cache) >= self.max_size:
            # Remove oldest item
            oldest_key = min(self.cache.keys(), key=lambda k: self.cache[k]['timestamp'])
            del self.cache[oldest_key]
        
        self.cache[key] = {
            'data': data,
            'timestamp': time.time()
        }
    
    def stats(self):
        """Get cache statistics"""
        hit_rate = self.hits / (self.hits + self.misses) if (self.hits + self.misses) > 0 else 0
        return {
            'size': len(self.cache),
            'hits': self.hits,
            'misses': self.misses,
            'hit_rate': f"{hit_rate:.1%}"
        }

class PerformanceTracker:
    """Track performance metrics"""
    
    def __init__(self):
        self.metrics = {}
    
    def start(self, operation):
        """Start timing an operation"""
        self.metrics[operation] = {
            'start': time.perf_counter(),
            'end': None,
            'duration': None
        }
    
    def end(self, operation):
        """End timing an operation"""
        if operation in self.metrics:
            self.metrics[operation]['end'] = time.perf_counter()
            self.metrics[operation]['duration'] = (
                self.metrics[operation]['end'] - self.metrics[operation]['start']
            ) * 1000  # Convert to milliseconds
    
    def get_report(self):
        """Get performance report"""
        report = {}
        for op, data in self.metrics.items():
            if data['duration'] is not None:
                report[op] = f"{data['duration']:.2f}ms"
        return report

class DataValidator:
    """Validate input data"""
    
    @staticmethod
    def validate_prediction_input(data: Dict) -> tuple[bool, str]:
        """Validate prediction input data"""
        required_fields = ['temperature', 'hour', 'day_of_week']
        
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"
            
            value = data[field]
            if field == 'temperature':
                if not (-50 <= value <= 50):
                    return False, "Temperature must be between -50°C and 50°C"
            elif field == 'hour':
                if not (0 <= value <= 23):
                    return False, "Hour must be between 0 and 23"
            elif field == 'day_of_week':
                if not (0 <= value <= 6):
                    return False, "Day of week must be between 0 (Monday) and 6 (Sunday)"
        
        return True, "Valid"

class ElectricityUtils:
    """Electricity-specific utilities"""
    
    @staticmethod
    def get_user_category(average_kwh: float, config) -> Dict:
        """Determine user category based on consumption"""
        for category, info in config.USER_CATEGORIES.items():
            if average_kwh <= info['max']:
                return {
                    'category': category,
                    'color': info['color'],
                    'icon': info['icon'],
                    'description': f"{category.replace('_', ' ').title()} User"
                }
        
        return {
            'category': 'excessive',
            'color': '#DC2626',
            'icon': 'exclamation-triangle',
            'description': 'Excessive User'
        }
    
    @staticmethod
    def format_kwh(value: float) -> str:
        """Format kWh value"""
        if value < 1:
            return f"{value*1000:.0f} W"
        elif value < 1000:
            return f"{value:.1f} kWh"
        else:
            return f"{value/1000:.2f} MWh"
    
    @staticmethod
    def format_pkr(value: float) -> str:
        """Format PKR value"""
        if value >= 1000000:
            return f"PKR {value/1000000:.2f}M"
        elif value >= 1000:
            return f"PKR {value/1000:.1f}K"
        else:
            return f"PKR {value:.2f}"

# Global instances
cache = Cache()
performance = PerformanceTracker()
validator = DataValidator()
electricity_utils = ElectricityUtils()