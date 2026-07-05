"""
Advice Generator for Energy Consumption Optimization
Generates personalized energy-saving recommendations
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Any
import json

logger = logging.getLogger(__name__)

class AdviceEngine:
    """
    Advice Engine for generating energy-saving recommendations
    """
    
    def __init__(self, prediction_engine):
        """
        Initialize Advice Engine
        
        Args:
            prediction_engine: PredictionEngine instance
        """
        self.prediction_engine = prediction_engine
        self.model_manager = prediction_engine.model_manager
        self.advice_templates = self._load_advice_templates()
        self.conversion_rate = 8.0  # ₹ per kWh
        
        logger.info("✅ Advice Engine initialized")
    
    def _load_advice_templates(self) -> Dict[str, List[Dict]]:
        """Load advice templates for different scenarios"""
        return {
            "residential": [
                {
                    "category": "Lighting",
                    "action": "Switch to LED bulbs",
                    "savings_percent": 15,
                    "cost": 500,
                    "payback_months": 6,
                    "difficulty": "Low",
                    "impact": "Medium"
                },
                {
                    "category": "Appliances",
                    "action": "Use energy-efficient appliances",
                    "savings_percent": 10,
                    "cost": 2000,
                    "payback_months": 12,
                    "difficulty": "Medium",
                    "impact": "High"
                },
                {
                    "category": "HVAC",
                    "action": "Optimize thermostat settings",
                    "savings_percent": 8,
                    "cost": 0,
                    "payback_months": 0,
                    "difficulty": "Low",
                    "impact": "Medium"
                },
                {
                    "category": "Behavior",
                    "action": "Turn off unused devices",
                    "savings_percent": 5,
                    "cost": 0,
                    "payback_months": 0,
                    "difficulty": "Low",
                    "impact": "Low"
                }
            ],
            "commercial": [
                {
                    "category": "Lighting",
                    "action": "Install motion sensors",
                    "savings_percent": 20,
                    "cost": 5000,
                    "payback_months": 8,
                    "difficulty": "Medium",
                    "impact": "High"
                },
                {
                    "category": "HVAC",
                    "action": "Regular maintenance of AC systems",
                    "savings_percent": 12,
                    "cost": 3000,
                    "payback_months": 6,
                    "difficulty": "Medium",
                    "impact": "High"
                },
                {
                    "category": "Equipment",
                    "action": "Power management for computers",
                    "savings_percent": 7,
                    "cost": 1000,
                    "payback_months": 4,
                    "difficulty": "Low",
                    "impact": "Medium"
                }
            ],
            "industrial": [
                {
                    "category": "Machinery",
                    "action": "Optimize equipment schedules",
                    "savings_percent": 25,
                    "cost": 0,
                    "payback_months": 0,
                    "difficulty": "Medium",
                    "impact": "High"
                },
                {
                    "category": "Process",
                    "action": "Implement energy monitoring",
                    "savings_percent": 15,
                    "cost": 10000,
                    "payback_months": 12,
                    "difficulty": "High",
                    "impact": "High"
                },
                {
                    "category": "Lighting",
                    "action": "High-efficiency industrial lighting",
                    "savings_percent": 18,
                    "cost": 8000,
                    "payback_months": 10,
                    "difficulty": "Medium",
                    "impact": "Medium"
                }
            ]
        }
    
    def generate_advice(self, days: int = 7, customer_profile: str = "residential") -> Dict[str, Any]:
        """
        Generate personalized energy-saving advice
        
        Args:
            days: Number of days to analyze
            customer_profile: Type of customer (residential/commercial/industrial)
        
        Returns:
            Dictionary with advice and recommendations
        """
        try:
            advice_id = f"ADV_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{np.random.randint(1000, 9999)}"
            
            # Get historical data for analysis
            historical_data = self.prediction_engine.get_historical_analysis(days)
            
            # Get current consumption patterns
            current_patterns = self._analyze_consumption_patterns(historical_data)
            
            # Select appropriate advice templates
            templates = self.advice_templates.get(customer_profile, self.advice_templates["residential"])
            
            # Personalize recommendations based on analysis
            recommendations = self._personalize_recommendations(templates, current_patterns)
            
            # Calculate potential savings
            savings = self._calculate_savings(recommendations, historical_data)
            
            # Create implementation plan
            implementation_plan = self._create_implementation_plan(recommendations)
            
            return {
                "advice_id": advice_id,
                "generated_at": datetime.now().isoformat(),
                "customer_profile": customer_profile,
                "analysis_period_days": days,
                "current_patterns": current_patterns,
                "recommendations": recommendations,
                "savings": savings,
                "implementation_plan": implementation_plan,
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Error generating advice: {str(e)}")
            return self._generate_fallback_advice(customer_profile)
    
    def generate_custom_advice(self, budget_constraint: float = None, 
                              timeline_days: int = 30, 
                              priority: str = "savings") -> Dict[str, Any]:
        """
        Generate custom advice based on constraints
        
        Args:
            budget_constraint: Maximum budget (optional)
            timeline_days: Implementation timeline in days
            priority: Priority criteria (savings/comfort/balanced)
        
        Returns:
            Custom advice dictionary
        """
        try:
            advice_id = f"CUSTOM_ADV_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # Get recommendations for all profiles
            all_recommendations = []
            for profile in ["residential", "commercial", "industrial"]:
                advice = self.generate_advice(7, profile)
                all_recommendations.extend(advice["recommendations"])
            
            # Filter by constraints
            filtered_recommendations = self._filter_by_constraints(
                all_recommendations, budget_constraint, timeline_days, priority
            )
            
            # Rank recommendations
            ranked_recommendations = self._rank_recommendations(
                filtered_recommendations, priority
            )
            
            return {
                "advice_id": advice_id,
                "custom_constraints": {
                    "budget": budget_constraint,
                    "timeline_days": timeline_days,
                    "priority": priority
                },
                "recommendations": ranked_recommendations[:5],  # Top 5
                "estimated_impact": self._estimate_custom_impact(ranked_recommendations),
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Error generating custom advice: {str(e)}")
            return {
                "error": str(e),
                "success": False
            }
    
    def _analyze_consumption_patterns(self, historical_data: Dict) -> Dict[str, Any]:
        """Analyze consumption patterns from historical data"""
        try:
            if historical_data and "data" in historical_data:
                data = historical_data["data"]
                
                # Extract consumption values
                if "consumption" in data:
                    consumption = data["consumption"]
                elif isinstance(data, list) and len(data) > 0:
                    # Try to find consumption column
                    if isinstance(data[0], dict):
                        consumption = [item.get("total_consumption", 0) for item in data]
                    else:
                        consumption = data
                else:
                    consumption = []
                
                if consumption:
                    consumption_array = np.array(consumption)
                    
                    return {
                        "average_daily": float(np.mean(consumption_array)),
                        "peak_consumption": float(np.max(consumption_array)),
                        "off_peak_ratio": float(np.mean(consumption_array < np.percentile(consumption_array, 50))),
                        "variability": float(np.std(consumption_array) / np.mean(consumption_array)),
                        "peak_hours": self._identify_peak_hours(historical_data)
                    }
            
            # Return default patterns if analysis fails
            return {
                "average_daily": 50.0,
                "peak_consumption": 100.0,
                "off_peak_ratio": 0.6,
                "variability": 0.3,
                "peak_hours": [18, 19, 20]
            }
            
        except Exception as e:
            logger.warning(f"Consumption pattern analysis failed: {str(e)}")
            return {
                "average_daily": 50.0,
                "peak_consumption": 100.0,
                "off_peak_ratio": 0.6,
                "variability": 0.3,
                "peak_hours": [18, 19, 20]
            }
    
    def _identify_peak_hours(self, historical_data: Dict) -> List[int]:
        """Identify peak consumption hours"""
        try:
            # Simplified peak hour identification
            # In production, this would analyze time-series data
            return [17, 18, 19, 20]  # Typical evening peak hours
        except:
            return [18, 19, 20]
    
    def _personalize_recommendations(self, templates: List[Dict], 
                                    patterns: Dict) -> List[Dict]:
        """Personalize recommendations based on consumption patterns"""
        personalized = []
        
        for template in templates:
            personalized_rec = template.copy()
            
            # Adjust savings based on patterns
            base_savings = template["savings_percent"]
            variability = patterns.get("variability", 0.3)
            peak_ratio = patterns.get("off_peak_ratio", 0.6)
            
            # Adjust based on patterns
            if variability > 0.4:
                # High variability means more savings potential
                adjusted_savings = base_savings * 1.2
            elif peak_ratio < 0.5:
                # Mostly peak usage
                adjusted_savings = base_savings * 1.1
            else:
                adjusted_savings = base_savings
            
            personalized_rec["personalized_savings_percent"] = min(round(adjusted_savings, 1), 30)
            personalized_rec["estimated_annual_savings_inr"] = round(
                patterns.get("average_daily", 50) * 365 * 
                personalized_rec["personalized_savings_percent"] / 100 * 
                self.conversion_rate, 2
            )
            
            personalized.append(personalized_rec)
        
        return personalized
    
    def _calculate_savings(self, recommendations: List[Dict], 
                          historical_data: Dict) -> Dict[str, float]:
        """Calculate potential savings from recommendations"""
        try:
            base_consumption = historical_data.get("average_consumption", 50)
            if not base_consumption:
                base_consumption = 50
            
            weekly_savings = 0
            for rec in recommendations:
                savings_percent = rec.get("personalized_savings_percent", rec.get("savings_percent", 5))
                weekly_savings += base_consumption * 7 * savings_percent / 100
            
            monthly_savings = weekly_savings * 4.33
            yearly_savings = monthly_savings * 12
            
            return {
                "weekly_kwh": round(weekly_savings, 2),
                "monthly_kwh": round(monthly_savings, 2),
                "yearly_kwh": round(yearly_savings, 2),
                "weekly_inr": round(weekly_savings * self.conversion_rate, 2),
                "monthly_inr": round(monthly_savings * self.conversion_rate, 2),
                "yearly_inr": round(yearly_savings * self.conversion_rate, 2),
                "currency": "INR"
            }
        except:
            # Default savings estimates
            return {
                "weekly_kwh": 35.5,
                "monthly_kwh": 153.7,
                "yearly_kwh": 1844.4,
                "weekly_inr": 284.0,
                "monthly_inr": 1229.6,
                "yearly_inr": 14755.2,
                "currency": "INR"
            }
    
    def _create_implementation_plan(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Create implementation plan for recommendations"""
        # Group by difficulty
        easy_tasks = [r for r in recommendations if r.get("difficulty", "Medium") == "Low"]
        medium_tasks = [r for r in recommendations if r.get("difficulty", "Medium") == "Medium"]
        hard_tasks = [r for r in recommendations if r.get("difficulty", "Medium") == "High"]
        
        return {
            "phase_1_immediate": {
                "duration_days": 7,
                "tasks": [r["action"] for r in easy_tasks[:2]],
                "expected_savings_percent": sum(r.get("personalized_savings_percent", 0) for r in easy_tasks[:2])
            },
            "phase_2_short_term": {
                "duration_days": 30,
                "tasks": [r["action"] for r in easy_tasks[2:] + medium_tasks[:2]],
                "expected_savings_percent": sum(r.get("personalized_savings_percent", 0) 
                                               for r in easy_tasks[2:] + medium_tasks[:2])
            },
            "phase_3_long_term": {
                "duration_days": 90,
                "tasks": [r["action"] for r in medium_tasks[2:] + hard_tasks],
                "expected_savings_percent": sum(r.get("personalized_savings_percent", 0) 
                                               for r in medium_tasks[2:] + hard_tasks)
            },
            "total_duration_days": 90,
            "total_expected_savings_percent": sum(r.get("personalized_savings_percent", 0) 
                                                 for r in recommendations)
        }
    
    def _filter_by_constraints(self, recommendations: List[Dict], 
                              budget: float, timeline: int, 
                              priority: str) -> List[Dict]:
        """Filter recommendations by constraints"""
        filtered = []
        
        for rec in recommendations:
            # Budget constraint
            if budget is not None and rec.get("cost", 0) > budget:
                continue
            
            # Timeline constraint (simplified)
            difficulty = rec.get("difficulty", "Medium")
            if timeline < 30 and difficulty == "High":
                continue
            if timeline < 7 and difficulty in ["Medium", "High"]:
                continue
            
            filtered.append(rec)
        
        return filtered
    
    def _rank_recommendations(self, recommendations: List[Dict], 
                             priority: str) -> List[Dict]:
        """Rank recommendations by priority"""
        if priority == "savings":
            return sorted(recommendations, 
                         key=lambda x: x.get("personalized_savings_percent", 0), 
                         reverse=True)
        elif priority == "comfort":
            # Rank by difficulty (easier first)
            difficulty_order = {"Low": 1, "Medium": 2, "High": 3}
            return sorted(recommendations, 
                         key=lambda x: difficulty_order.get(x.get("difficulty", "Medium"), 2))
        else:  # balanced
            # Rank by savings to cost ratio
            ranked = []
            for rec in recommendations:
                savings = rec.get("personalized_savings_percent", 5)
                cost = max(rec.get("cost", 1), 1)
                ratio = savings / cost
                rec["value_ratio"] = ratio
                ranked.append(rec)
            
            return sorted(ranked, key=lambda x: x["value_ratio"], reverse=True)
    
    def _estimate_custom_impact(self, recommendations: List[Dict]) -> Dict[str, Any]:
        """Estimate impact of custom recommendations"""
        if not recommendations:
            return {"total_savings_percent": 0, "total_cost": 0}
        
        total_savings = sum(r.get("personalized_savings_percent", 0) for r in recommendations)
        total_cost = sum(r.get("cost", 0) for r in recommendations)
        
        return {
            "total_savings_percent": round(total_savings, 1),
            "total_cost_inr": round(total_cost, 2),
            "average_payback_months": round(
                sum(r.get("payback_months", 12) for r in recommendations) / len(recommendations), 1
            ),
            "recommendation_count": len(recommendations)
        }
    
    def _generate_fallback_advice(self, customer_profile: str) -> Dict[str, Any]:
        """Generate fallback advice when analysis fails"""
        return {
            "advice_id": f"FALLBACK_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "customer_profile": customer_profile,
            "recommendations": self.advice_templates.get(customer_profile, self.advice_templates["residential"])[:3],
            "savings": {
                "weekly_kwh": 25.0,
                "monthly_kwh": 108.3,
                "yearly_kwh": 1300.0,
                "weekly_inr": 200.0,
                "monthly_inr": 866.4,
                "yearly_inr": 10400.0,
                "currency": "INR"
            },
            "implementation_plan": {
                "phase_1_immediate": {
                    "duration_days": 7,
                    "tasks": ["Turn off unused lights", "Unplug idle devices"],
                    "expected_savings_percent": 10
                }
            },
            "note": "Generated fallback advice. For personalized recommendations, ensure proper data access.",
            "success": True
        }    
    def generate_7day_advice(self, customer_profile: str = "residential", 
                            budget_constraint: float = None,
                            priority: str = "balanced") -> Dict[str, Any]:
        """
        Generate dynamic 7-day personalized advice with daily actionable tips
        """
        try:
            logger.info(f"Generating 7-day advice for {customer_profile} profile")
            
            templates = self.advice_templates.get(customer_profile, self.advice_templates["residential"])
            days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            daily_advice = []
            
            weekly_predictions = self._get_weekly_predictions()
            
            for day_num, day_name in enumerate(days_of_week, 1):
                day_data = self._generate_daily_advice_data(
                    day_num, day_name, templates, 
                    weekly_predictions.get(day_num, {}), customer_profile
                )
                daily_advice.append(day_data)
            
            weekly_summary = self._calculate_weekly_summary(daily_advice, customer_profile)
            action_plan = self._create_weekly_action_plan(daily_advice, priority)
            
            return {
                "advice_id": f"7DAY_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{np.random.randint(1000, 9999)}",
                "generated_at": datetime.now().isoformat(),
                "customer_profile": customer_profile,
                "priority": priority,
                "budget_constraint": budget_constraint,
                "daily_advice": daily_advice,
                "weekly_summary": weekly_summary,
                "action_plan": action_plan,
                "success": True
            }
        except Exception as e:
            logger.error(f"Error generating 7-day advice: {str(e)}")
            return self._generate_fallback_7day_advice(customer_profile)
    
    def _get_weekly_predictions(self) -> Dict[int, Dict]:
        """Get predicted consumption for the week"""
        try:
            predictions = {}
            current_date = datetime.now()
            
            for day in range(1, 8):
                future_date = current_date + timedelta(days=day-1)
                hour = future_date.hour
                is_weekend = future_date.weekday() >= 5
                
                base_consumption = 50
                if is_weekend:
                    base_consumption *= 0.85
                
                if 18 <= hour <= 22:
                    base_consumption *= 1.3
                elif 8 <= hour <= 17:
                    base_consumption *= 1.1
                else:
                    base_consumption *= 0.7
                
                base_consumption *= np.random.uniform(0.95, 1.05)
                
                predictions[day] = {
                    "consumption_kwh": round(base_consumption, 2),
                    "cost_inr": round(base_consumption * self.conversion_rate, 2),
                    "is_weekend": is_weekend,
                    "date": future_date.strftime("%Y-%m-%d"),
                    "day_name": future_date.strftime("%A")
                }
            
            return predictions
        except Exception as e:
            logger.error(f"Error getting weekly predictions: {str(e)}")
            return {}
    
    def _generate_daily_advice_data(self, day_num: int, day_name: str, 
                                   templates: List[Dict], prediction: Dict,
                                   customer_profile: str) -> Dict[str, Any]:
        """Generate advice for a specific day"""
        
        day_specific_advice = self._get_day_specific_advice(day_num, day_name, customer_profile)
        predicted_consumption = prediction.get("consumption_kwh", 50)
        predicted_cost = prediction.get("cost_inr", predicted_consumption * self.conversion_rate)
        is_weekend = prediction.get("is_weekend", False)
        
        priority_level = "medium"
        if predicted_consumption > 60:
            priority_level = "high"
        elif predicted_consumption < 40:
            priority_level = "low"
        
        savings_percent = day_specific_advice.get("savings_percent", 10)
        savings_kwh = predicted_consumption * savings_percent / 100
        savings_inr = savings_kwh * self.conversion_rate
        
        return {
            "day": day_num,
            "day_name": day_name,
            "date": prediction.get("date", (datetime.now() + timedelta(days=day_num-1)).strftime("%Y-%m-%d")),
            "is_weekend": is_weekend,
            "predicted_consumption_kwh": round(predicted_consumption, 2),
            "predicted_cost_inr": round(predicted_cost, 2),
            "priority": priority_level,
            "advice": day_specific_advice["advice"],
            "action": day_specific_advice["action"],
            "tips": day_specific_advice["tips"],
            "savings_potential_kwh": round(savings_kwh, 2),
            "savings_potential_inr": round(savings_inr, 2),
            "savings_percent": savings_percent,
            "difficulty": day_specific_advice["difficulty"],
            "time_required": day_specific_advice["time_required"]
        }
    
    def _get_day_specific_advice(self, day_num: int, day_name: str, customer_profile: str) -> Dict[str, Any]:
        """Get specific advice tailored for each day of the week"""
        
        advice_by_day = {
            1: {"advice": "Start your week with an energy audit", "action": "Check all appliances and ensure nothing unnecessary is running. Set your thermostat to optimal temperature.", "tips": ["Review weekend energy consumption", "Plan energy-efficient week ahead", "Check AC/heating settings for the week"], "savings_percent": 12, "difficulty": "Easy", "time_required": "15 minutes"},
            2: {"advice": "Optimize your lighting setup", "action": "Replace high-usage bulbs with LEDs. Turn off lights in unused rooms during the day.", "tips": ["Use natural light whenever possible", "Install timers on outdoor lights", "Clean light fixtures for better efficiency"], "savings_percent": 10, "difficulty": "Easy", "time_required": "20 minutes"},
            3: {"advice": "Focus on kitchen and laundry efficiency", "action": "Use cold water for laundry. Run dishwasher only when full. Defrost refrigerator if needed.", "tips": ["Batch cook to reduce oven usage", "Keep refrigerator coils clean", "Use pressure cooker for faster cooking"], "savings_percent": 15, "difficulty": "Medium", "time_required": "30 minutes"},
            4: {"advice": "Electronics and phantom power day", "action": "Unplug devices not in use. Use power strips for easy control. Enable power-saving modes.", "tips": ["Unplug phone chargers when not charging", "Turn off computers at night", "Disable standby mode on TVs and gaming consoles"], "savings_percent": 8, "difficulty": "Easy", "time_required": "10 minutes"},
            5: {"advice": "HVAC maintenance and optimization", "action": "Clean/replace AC filters. Check for air leaks around windows and doors. Adjust thermostat for weekend.", "tips": ["Use ceiling fans to reduce AC load", "Close curtains during hottest part of day", "Set programmable thermostat for weekend"], "savings_percent": 18, "difficulty": "Medium", "time_required": "45 minutes"},
            6: {"advice": "Weekend deep energy optimization", "action": "Conduct thorough home energy inspection. Fix any issues found during the week.", "tips": ["Check insulation in attic and walls", "Inspect water heater temperature setting", "Schedule professional energy audit if needed"], "savings_percent": 20, "difficulty": "Hard", "time_required": "2 hours"},
            7: {"advice": "Plan and prepare for energy-efficient week ahead", "action": "Review this week's savings. Meal prep to reduce cooking energy. Set automation schedules.", "tips": ["Charge all devices during off-peak hours", "Prep smart home automation for the week", "Review and adjust goals for next week"], "savings_percent": 10, "difficulty": "Easy", "time_required": "30 minutes"}
        }
        
        base_advice = advice_by_day.get(day_num, advice_by_day[1])
        
        if customer_profile == "commercial":
            base_advice = dict(base_advice)
            base_advice["savings_percent"] = int(base_advice["savings_percent"] * 1.3)
            base_advice["action"] = base_advice["action"].replace("home", "workplace")
        elif customer_profile == "industrial":
            base_advice = dict(base_advice)
            base_advice["savings_percent"] = int(base_advice["savings_percent"] * 1.5)
            base_advice["action"] = base_advice["action"].replace("home", "facility")
        
        return base_advice
    
    def _calculate_weekly_summary(self, daily_advice: List[Dict], customer_profile: str) -> Dict[str, Any]:
        """Calculate summary statistics for the week"""
        
        total_consumption = sum(day["predicted_consumption_kwh"] for day in daily_advice)
        total_cost = sum(day["predicted_cost_inr"] for day in daily_advice)
        total_savings_kwh = sum(day["savings_potential_kwh"] for day in daily_advice)
        total_savings_inr = sum(day["savings_potential_inr"] for day in daily_advice)
        
        avg_daily_consumption = total_consumption / 7
        peak_day = max(daily_advice, key=lambda x: x["predicted_consumption_kwh"])
        lowest_day = min(daily_advice, key=lambda x: x["predicted_consumption_kwh"])
        
        return {
            "total_predicted_consumption_kwh": round(total_consumption, 2),
            "total_predicted_cost_inr": round(total_cost, 2),
            "average_daily_consumption_kwh": round(avg_daily_consumption, 2),
            "peak_consumption_day": peak_day["day_name"],
            "peak_consumption_kwh": peak_day["predicted_consumption_kwh"],
            "lowest_consumption_day": lowest_day["day_name"],
            "lowest_consumption_kwh": lowest_day["predicted_consumption_kwh"],
            "total_savings_potential_kwh": round(total_savings_kwh, 2),
            "total_savings_potential_inr": round(total_savings_inr, 2),
            "savings_percentage": round((total_savings_kwh / total_consumption) * 100, 1) if total_consumption > 0 else 0,
            "high_priority_days": [day["day_name"] for day in daily_advice if day["priority"] == "high"],
            "weekend_vs_weekday_ratio": round(
                sum(d["predicted_consumption_kwh"] for d in daily_advice if d["is_weekend"]) / 
                sum(d["predicted_consumption_kwh"] for d in daily_advice if not d["is_weekend"]), 2
            ) if len([d for d in daily_advice if not d["is_weekend"]]) > 0 else 1.0
        }
    
    def _create_weekly_action_plan(self, daily_advice: List[Dict], priority: str) -> Dict[str, Any]:
        """Create structured action plan for the week"""
        
        high_priority_actions = [day for day in daily_advice if day["priority"] == "high"]
        medium_priority_actions = [day for day in daily_advice if day["priority"] == "medium"]
        low_priority_actions = [day for day in daily_advice if day["priority"] == "low"]
        
        total_time_minutes = sum(
            int(day["time_required"].split()[0]) if "hour" not in day["time_required"] 
            else int(day["time_required"].split()[0]) * 60 
            for day in daily_advice
        )
        
        return {
            "total_actions": len(daily_advice),
            "high_priority_count": len(high_priority_actions),
            "medium_priority_count": len(medium_priority_actions),
            "low_priority_count": len(low_priority_actions),
            "estimated_time_investment_minutes": total_time_minutes,
            "quick_wins": [
                {"day": day["day_name"], "action": day["action"], "savings": f"₹{day['savings_potential_inr']}"}
                for day in sorted(daily_advice, key=lambda x: x["savings_potential_inr"], reverse=True)[:3]
            ],
            "priority_focus": priority,
            "recommended_start_day": "Monday" if priority == "savings" else "Weekend"
        }
    
    def generate_daily_advice(self, day_num: int) -> Dict[str, Any]:
        """Generate advice for a specific day (1-7)"""
        try:
            days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            day_name = days_of_week[day_num - 1]
            
            predictions = self._get_weekly_predictions()
            prediction = predictions.get(day_num, {})
            
            advice_data = self._generate_daily_advice_data(
                day_num, day_name, self.advice_templates["residential"],
                prediction, "residential"
            )
            
            return advice_data
        except Exception as e:
            logger.error(f"Error generating daily advice: {str(e)}")
            return {"error": str(e), "day": day_num}
    
    def _generate_fallback_7day_advice(self, customer_profile: str) -> Dict[str, Any]:
        """Generate fallback 7-day advice when detailed analysis fails"""
        
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        fallback_daily = []
        
        for day_num, day_name in enumerate(days_of_week, 1):
            fallback_daily.append({
                "day": day_num,
                "day_name": day_name,
                "date": (datetime.now() + timedelta(days=day_num-1)).strftime("%Y-%m-%d"),
                "is_weekend": day_num in [6, 7],
                "predicted_consumption_kwh": 50.0,
                "predicted_cost_inr": 400.0,
                "priority": "medium",
                "advice": f"Energy-saving focus for {day_name}",
                "action": "Follow general energy-saving practices",
                "tips": ["Turn off unused devices", "Optimize temperature settings"],
                "savings_potential_kwh": 5.0,
                "savings_potential_inr": 40.0,
                "savings_percent": 10,
                "difficulty": "Easy",
                "time_required": "15 minutes"
            })
        
        return {
            "advice_id": f"FALLBACK_7DAY_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "generated_at": datetime.now().isoformat(),
            "customer_profile": customer_profile,
            "daily_advice": fallback_daily,
            "weekly_summary": {
                "total_predicted_consumption_kwh": 350.0,
                "total_predicted_cost_inr": 2800.0,
                "total_savings_potential_inr": 280.0,
                "savings_percentage": 10.0
            },
            "note": "Fallback 7-day advice generated",
            "success": True
        }