/**
 * AI Advisor - Provides personalized electricity advice
 */

class AIAdvisor {
    constructor() {
        this.baseURL = window.location.origin.replace(/:\d+/, ':5000');
        this.userProfile = null;
        this.adviceHistory = [];
        this.userId = this.generateUserId();
        
        this.init();
    }
    
    init() {
        console.log('🤖 AI Advisor initialized');
        this.loadUserProfile();
        this.setupEventListeners();
    }
    
    generateUserId() {
        // Generate or retrieve user ID
        let userId = localStorage.getItem('electricity_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('electricity_user_id', userId);
        }
        return userId;
    }
    
    async loadUserProfile() {
        try {
            const response = await fetch(`${this.baseURL}/api/user/profile?user_id=${this.userId}`);
            const data = await response.json();
            
            if (data.profile) {
                this.userProfile = data.profile;
                this.updateProfileUI();
                console.log('✅ User profile loaded:', this.userProfile);
            }
        } catch (error) {
            console.warn('Could not load user profile:', error);
        }
    }
    
    updateProfileUI() {
        if (!this.userProfile) return;
        
        // Update profile card
        const profileCard = document.getElementById('userProfileCard');
        if (profileCard) {
            profileCard.innerHTML = `
                <div class="profile-header" style="border-left: 4px solid ${this.userProfile.color}">
                    <div class="profile-icon">
                        <i class="fas fa-${this.userProfile.icon}"></i>
                    </div>
                    <div class="profile-info">
                        <h4>${this.userProfile.description}</h4>
                        <p>Average: ${this.userProfile.average_consumption.toFixed(1)} kWh/day</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-value">PKR ${this.userProfile.daily_average_cost.toFixed(2)}</span>
                        <span class="stat-label">Daily Cost</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${this.userProfile.savings_potential_percent}%</span>
                        <span class="stat-label">Savings Potential</span>
                    </div>
                </div>
            `;
        }
    }
    
    async getPersonalizedAdvice(predictionData) {
        try {
            const response = await fetch(`${this.baseURL}/api/advice/personalized?user_id=${this.userId}`);
            const data = await response.json();
            
            if (data.ai_advice) {
                this.displayAdvice(data.ai_advice);
                this.adviceHistory.push({
                    timestamp: new Date().toISOString(),
                    advice: data.ai_advice
                });
                return data.ai_advice;
            }
        } catch (error) {
            console.warn('Could not get AI advice:', error);
            return this.getFallbackAdvice(predictionData);
        }
    }
    
    displayAdvice(adviceList) {
        const adviceContainer = document.getElementById('aiAdviceContainer');
        if (!adviceContainer) return;
        
        let html = '<h3><i class="fas fa-robot"></i> AI Recommendations</h3>';
        
        adviceList.forEach((advice, index) => {
            const priorityClass = `priority-${advice.priority}`;
            const icon = this.getAdviceIcon(advice.type);
            
            html += `
                <div class="advice-card ${priorityClass}">
                    <div class="advice-header">
                        <div class="advice-icon">${icon}</div>
                        <div class="advice-title">
                            <h4>${advice.title}</h4>
                            <span class="advice-priority">${advice.priority.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="advice-body">
                        <p>${advice.message}</p>
                        <div class="advice-action">
                            <i class="fas fa-lightbulb"></i>
                            <strong>Action:</strong> ${advice.action}
                        </div>
                    </div>
                    <div class="advice-footer">
                        <div class="saving-badge">
                            <i class="fas fa-coins"></i>
                            Save PKR ${advice.saving_pkr}
                        </div>
                        <div class="impact-badge">
                            <i class="fas fa-chart-line"></i>
                            ${advice.impact} impact
                        </div>
                    </div>
                </div>
            `;
        });
        
        adviceContainer.innerHTML = html;
        this.animateAdviceCards();
    }
    
    getAdviceIcon(type) {
        const icons = {
            'peak_hour': '⏰',
            'temperature': '🌡️',
            'special_day': '🎉',
            'high_usage': '⚡',
            'investment': '🏠',
            'optimization': '🔧',
            'maintenance': '✅',
            'overview': '💰'
        };
        return icons[type] || '💡';
    }
    
    animateAdviceCards() {
        const cards = document.querySelectorAll('.advice-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    getFallbackAdvice(predictionData) {
        // Fallback advice if AI is unavailable
        const hour = new Date().getHours();
        const advice = [];
        
        if (hour >= 18 && hour <= 21) {
            advice.push({
                title: 'Peak Hour Warning',
                message: 'Using electricity during peak hours (6-9 PM) is more expensive.',
                action: 'Shift heavy appliance usage to after 10 PM',
                saving_pkr: '15-25',
                priority: 'high'
            });
        }
        
        if (predictionData && predictionData.consumption_kwh > 80) {
            advice.push({
                title: 'High Consumption Alert',
                message: 'Your consumption is above average.',
                action: 'Check AC settings and turn off unused appliances',
                saving_pkr: '20-30',
                priority: 'medium'
            });
        }
        
        advice.push({
            title: 'General Tip',
            message: 'Regular maintenance can save 10-15% on electricity bills.',
            action: 'Clean AC filters and check appliance efficiency',
            saving_pkr: '10-15',
            priority: 'low'
        });
        
        return advice;
    }
    
    async get7DayForecast() {
        try {
            const response = await fetch(`${this.baseURL}/api/forecast/7days?user_id=${this.userId}`);
            const data = await response.json();
            
            if (data.forecast && data.action_plan) {
                this.displayForecast(data.forecast);
                this.displayActionPlan(data.action_plan);
                return data;
            }
        } catch (error) {
            console.warn('Could not get forecast:', error);
        }
    }
    
    displayForecast(forecast) {
        const forecastContainer = document.getElementById('forecastContainer');
        if (!forecastContainer) return;
        
        let html = '<h3><i class="fas fa-calendar-alt"></i> 7-Day Forecast</h3>';
        html += '<div class="forecast-grid">';
        
        forecast.forEach(day => {
            const riskClass = `risk-${day.risk_level}`;
            html += `
                <div class="forecast-card ${riskClass}">
                    <div class="forecast-date">
                        <strong>${day.day}</strong>
                        <small>${day.date}</small>
                    </div>
                    <div class="forecast-data">
                        <div class="forecast-value">${day.predicted_consumption_kwh} kWh</div>
                        <div class="forecast-cost">PKR ${day.predicted_cost_pkr}</div>
                    </div>
                    <div class="forecast-risk">
                        <i class="fas fa-${day.risk_level === 'high' ? 'exclamation-triangle' : 'info-circle'}"></i>
                        ${day.risk_level.toUpperCase()} RISK
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        forecastContainer.innerHTML = html;
    }
    
    displayActionPlan(plan) {
        const planContainer = document.getElementById('actionPlanContainer');
        if (!planContainer) return;
        
        let html = '<h3><i class="fas fa-tasks"></i> Your Action Plan</h3>';
        html += `<div class="plan-summary">
                    <div class="plan-goal">Goal: ${plan.weekly_goal}</div>
                    <div class="plan-saving">Potential Weekly Savings: PKR ${plan.estimated_weekly_saving_pkr}</div>
                 </div>`;
        
        html += '<div class="daily-actions">';
        plan.daily_actions.forEach(action => {
            const priorityClass = `action-${action.priority}`;
            html += `
                <div class="action-item ${priorityClass}">
                    <div class="action-date">${action.date} (${action.day})</div>
                    <div class="action-details">
                        <div class="action-prediction">
                            <span>${action.predicted_kwh} kWh</span>
                            <small>PKR ${action.predicted_cost_pkr}</small>
                        </div>
                        <div class="action-description">${action.action}</div>
                    </div>
                    <div class="action-saving">
                        Save PKR ${action.saving_potential_pkr}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        planContainer.innerHTML = html;
    }
    
    setupEventListeners() {
        // Refresh advice button
        const refreshBtn = document.getElementById('refreshAdvice');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.getPersonalizedAdvice();
                this.showNotification('AI advice refreshed', 'success');
            });
        }
        
        // Forecast button
        const forecastBtn = document.getElementById('showForecast');
        if (forecastBtn) {
            forecastBtn.addEventListener('click', () => {
                this.get7DayForecast();
            });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize AI Advisor
document.addEventListener('DOMContentLoaded', () => {
    window.aiAdvisor = new AIAdvisor();
});