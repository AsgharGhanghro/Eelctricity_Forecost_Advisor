// Main Dashboard Controller
class DashboardController {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000';
        this.liveDataInterval = null;
        this.predictionsData = null;
        this.initialize();
    }
    
    initialize() {
        console.log('🚀 Initializing Dashboard...');
        
        // Set default values immediately to avoid showing 0:00
        this.setDefaultValues();
        
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        this.checkApiStatus();
        this.loadInitialData();
        
        // Start live data updates
        this.liveDataInterval = setInterval(() => this.fetchLiveData(), 10000);
    }
    
    setDefaultValues() {
        // Set reasonable defaults while data loads
        document.getElementById('currentUsage').textContent = '-- kW';
        document.getElementById('todayTotal').textContent = '-- kWh';
        document.getElementById('peakHour').textContent = 'Loading...';
        document.getElementById('estimatedCost').textContent = '₹ --';
        
        console.log('✅ Default values set');
    }
    
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }
    
    async checkApiStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/health`);
            const data = await response.json();
            
            const statusElement = document.getElementById('apiStatus');
            
            if (data.status === 'healthy') {
                statusElement.textContent = 'Connected ✓';
                statusElement.style.color = '#43e97b';
            } else {
                statusElement.textContent = 'Degraded';
                statusElement.style.color = '#f5576c';
            }
        } catch (error) {
            console.error('API check failed:', error);
            document.getElementById('apiStatus').textContent = 'Disconnected ✗';
            document.getElementById('apiStatus').style.color = '#f5576c';
        }
    }
    
    async loadInitialData() {
        console.log('📊 Loading initial data...');
        
        // Load predictions first (so we have peak hour data)
        await this.fetchPredictions(24);
        
        // Then load live data
        await this.fetchLiveData();
        
        console.log('✅ Initial data loaded');
    }
    
    async fetchLiveData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/live-data`);
            const data = await response.json();
            
            if (data.success) {
                this.updateLiveDisplay(data.live_data);
            }
        } catch (error) {
            console.error('Error fetching live data:', error);
        }
    }
    
    updateLiveDisplay(data) {
        // Update current usage
        const currentUsage = data.current_consumption || data.Usage_kW || 50.65;
        document.getElementById('currentUsage').textContent = `${currentUsage.toFixed(2)} kW`;
        
        // Update today's total
        const currentHour = new Date().getHours();
        const todayTotal = (currentUsage * currentHour).toFixed(1);
        document.getElementById('todayTotal').textContent = `${todayTotal} kWh`;
        
        // Update peak hour - Use predictions data if available, otherwise estimate
        let peakHourText = '--:--';
        if (this.predictionsData && this.predictionsData.length > 0) {
            // Find the hour with highest consumption from predictions
            let maxConsumption = 0;
            let peakHourIndex = 0;
            
            this.predictionsData.forEach((pred, index) => {
                if (pred.total_consumption > maxConsumption) {
                    maxConsumption = pred.total_consumption;
                    peakHourIndex = index;
                }
            });
            
            // Get the timestamp and extract hour
            const peakTimestamp = new Date(this.predictionsData[peakHourIndex].timestamp);
            const peakHour = peakTimestamp.getHours();
            peakHourText = `${peakHour}:00`;
        } else {
            // Fallback: Estimate peak hour (typically evening 18:00-20:00)
            const estimatedPeakHour = 18;
            peakHourText = `${estimatedPeakHour}:00`;
        }
        
        document.getElementById('peakHour').textContent = peakHourText;
        
        // Update estimated cost
        const estimatedCost = (todayTotal * 8).toFixed(2);
        document.getElementById('estimatedCost').textContent = `₹ ${estimatedCost}`;
    }
    
    async fetchPredictions(hours = 24) {
        try {
            console.log(`📡 Fetching ${hours} hour predictions...`);
            
            const response = await fetch(`${this.apiBaseUrl}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hours: hours,
                    mode: 'future'
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.predictions) {
                this.predictionsData = data.predictions;
                console.log(`✅ Received ${data.predictions.length} predictions`);
                
                this.updatePredictionsDisplay(data);
                this.updatePredictionsChart(data.predictions);
                this.updateComponentsChart(data.predictions);
            } else {
                console.error('❌ Prediction failed:', data.error);
                // Set fallback peak hour
                document.getElementById('peakHour').textContent = '18:00';
            }
        } catch (error) {
            console.error('❌ Error fetching predictions:', error);
            // Set fallback peak hour
            document.getElementById('peakHour').textContent = '18:00';
        }
    }
    
    updatePredictionsDisplay(data) {
        if (!data.summary) return;
        
        document.getElementById('peakPrediction').textContent = `${data.summary.peak_consumption.toFixed(2)} kW`;
        document.getElementById('avgPrediction').textContent = `${data.summary.average_consumption.toFixed(2)} kW`;
        document.getElementById('totalCost').textContent = `₹ ${data.summary.cost_estimate.toFixed(2)}`;
        
        // Also update peak hour in stat card if predictions are available
        if (data.predictions && data.predictions.length > 0) {
            let maxConsumption = 0;
            let peakHourIndex = 0;
            
            data.predictions.forEach((pred, index) => {
                if (pred.total_consumption > maxConsumption) {
                    maxConsumption = pred.total_consumption;
                    peakHourIndex = index;
                }
            });
            
            // Update the peak hour stat card
            const peakTimestamp = new Date(data.predictions[peakHourIndex].timestamp);
            const peakHour = peakTimestamp.getHours();
            document.getElementById('peakHour').textContent = `${peakHour}:00`;
            
            console.log(`✅ Peak hour identified: ${peakHour}:00 with ${maxConsumption.toFixed(2)} kW`);
        }
    }
    
    updatePredictionsChart(predictions) {
        const timestamps = predictions.map(p => {
            const date = new Date(p.timestamp);
            return date.toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit'
            });
        });
        
        const usages = predictions.map(p => p.total_consumption);
        
        const trace = {
            x: timestamps,
            y: usages,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Predicted Usage',
            line: { 
                color: '#667eea', 
                width: 3,
                shape: 'spline'
            },
            marker: { 
                size: 6,
                color: '#667eea'
            },
            fill: 'tozeroy',
            fillcolor: 'rgba(102, 126, 234, 0.1)'
        };
        
        const layout = {
            title: `${predictions.length}-Hour Electricity Consumption Forecast`,
            xaxis: { 
                title: 'Time',
                tickangle: -45
            },
            yaxis: { 
                title: 'Usage (kW)',
                gridcolor: '#e9ecef'
            },
            height: 400,
            margin: { t: 50, r: 30, l: 60, b: 100 },
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#f8f9fa',
            font: {
                family: 'Segoe UI, sans-serif'
            }
        };
        
        Plotly.newPlot('predictionChart', [trace], layout, {responsive: true});
    }
    
    updateComponentsChart(predictions) {
        if (!predictions || predictions.length === 0) return;
        
        // Use first prediction's components
        const components = predictions[0].components;
        
        const data = [{
            values: Object.values(components),
            labels: Object.keys(components),
            type: 'pie',
            marker: {
                colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b']
            }
        }];
        
        const layout = {
            title: 'Energy Consumption by Component',
            height: 350,
            showlegend: true,
            font: {
                family: 'Segoe UI, sans-serif'
            }
        };
        
        Plotly.newPlot('componentsChart', data, layout, {responsive: true});
    }
    
    async fetchExplanations() {
        try {
            console.log('Fetching AI explanations...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/explain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.updateExplanationsDisplay(data.explanations);
                this.updateXAIChart(data.explanations.feature_importance);
            }
        } catch (error) {
            console.error('Error fetching explanations:', error);
        }
    }
    
    updateExplanationsDisplay(explanations) {
        const container = document.getElementById('explanationsList');
        container.innerHTML = '';
        
        // Create explanation items
        const features = Object.entries(explanations.feature_importance);
        
        features.forEach(([feature, importance]) => {
            const div = document.createElement('div');
            div.className = 'explanation-item';
            
            let impactLevel = 'Medium';
            let impactColor = '#fdcb6e';
            
            if (importance > 0.2) {
                impactLevel = 'High';
                impactColor = '#ff6b6b';
            } else if (importance < 0.1) {
                impactLevel = 'Low';
                impactColor = '#00b894';
            }
            
            div.innerHTML = `
                <strong>${feature}</strong>
                <span class="impact-badge" style="background: ${impactColor}">
                    ${impactLevel} Impact
                </span>
                <p>Importance Score: ${(importance * 100).toFixed(1)}%</p>
            `;
            container.appendChild(div);
        });
    }
    
    updateXAIChart(featureImportance) {
        const features = Object.keys(featureImportance);
        const importance = Object.values(featureImportance);
        
        const trace = {
            y: features,
            x: importance,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: importance.map(val => {
                    if (val > 0.2) return '#ff6b6b';
                    if (val > 0.1) return '#fdcb6e';
                    return '#00b894';
                })
            }
        };
        
        const layout = {
            title: 'Feature Importance Analysis',
            xaxis: { title: 'Importance Score' },
            yaxis: { title: 'Features' },
            height: 400,
            margin: { t: 50, r: 30, l: 150, b: 50 },
            font: {
                family: 'Segoe UI, sans-serif'
            }
        };
        
        Plotly.newPlot('xaiChart', [trace], layout, {responsive: true});
    }
    
    async fetchEnergyAdvice() {
        try {
            console.log('Fetching energy advice...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/advice`);
            const data = await response.json();
            
            if (data.success) {
                this.updateAdviceDisplay(data.advice);
            }
        } catch (error) {
            console.error('Error fetching advice:', error);
        }
    }
    
    async fetch7DayAdvice() {
        try {
            console.log('Fetching 7-day advice...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/advice/7days`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_type: 'residential',
                    priority: 'balanced'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.update7DayAdviceDisplay(data.advice_7days);
            }
        } catch (error) {
            console.error('Error fetching 7-day advice:', error);
        }
    }
    
    updateAdviceDisplay(advice) {
        // Update savings
        if (advice.savings) {
            document.getElementById('savingsAmount').textContent = 
                `₹ ${advice.savings.monthly_inr || advice.savings.monthly || 0}`;
        }
        
        // Update advice list
        const container = document.getElementById('adviceList');
        container.innerHTML = '';
        
        if (advice.recommendations) {
            advice.recommendations.forEach(rec => {
                const div = document.createElement('div');
                div.className = 'advice-card';
                div.innerHTML = `
                    <h4>${rec.action}</h4>
                    <p><strong>Category:</strong> ${rec.category}</p>
                    <p><strong>Difficulty:</strong> ${rec.difficulty}</p>
                    <p><strong>Expected Savings:</strong> ${rec.personalized_savings_percent || rec.savings_percent}%</p>
                    <p><strong>Est. Annual Savings:</strong> ₹${rec.estimated_annual_savings_inr || 0}</p>
                `;
                container.appendChild(div);
            });
        }
    }
    
    update7DayAdviceDisplay(advice7days) {
        const container = document.getElementById('adviceList');
        container.innerHTML = '';
        
        // Display weekly summary
        if (advice7days.weekly_summary) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'weekly-summary-card';
            summaryDiv.innerHTML = `
                <h3><i class="fas fa-calendar-week"></i> Weekly Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Total Consumption</span>
                        <span class="summary-value">${advice7days.weekly_summary.total_predicted_consumption_kwh} kWh</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Total Cost</span>
                        <span class="summary-value">₹${advice7days.weekly_summary.total_predicted_cost_inr}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Savings Potential</span>
                        <span class="summary-value highlight">₹${advice7days.weekly_summary.total_savings_potential_inr}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Peak Day</span>
                        <span class="summary-value">${advice7days.weekly_summary.peak_consumption_day}</span>
                    </div>
                </div>
            `;
            container.appendChild(summaryDiv);
            
            // Update savings amount
            document.getElementById('savingsAmount').textContent = 
                `₹ ${advice7days.weekly_summary.total_savings_potential_inr}`;
        }
        
        // Display daily advice
        if (advice7days.daily_advice) {
            const daysContainer = document.createElement('div');
            daysContainer.className = 'days-container';
            
            advice7days.daily_advice.forEach(day => {
                const dayCard = document.createElement('div');
                dayCard.className = `day-advice-card priority-${day.priority}`;
                
                const priorityColor = {
                    'high': '#ff6b6b',
                    'medium': '#fdcb6e',
                    'low': '#00b894'
                };
                
                dayCard.innerHTML = `
                    <div class="day-header" style="border-left: 4px solid ${priorityColor[day.priority]}">
                        <div class="day-info">
                            <h4>${day.day_name}</h4>
                            <span class="day-date">${day.date}</span>
                            <span class="priority-badge" style="background: ${priorityColor[day.priority]}">${day.priority.toUpperCase()} PRIORITY</span>
                        </div>
                        <div class="day-stats">
                            <div class="stat-mini">
                                <span>${day.predicted_consumption_kwh} kWh</span>
                                <small>Predicted</small>
                            </div>
                            <div class="stat-mini">
                                <span>₹${day.predicted_cost_inr}</span>
                                <small>Cost</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="day-content">
                        <div class="advice-section">
                            <h5><i class="fas fa-lightbulb"></i> ${day.advice}</h5>
                            <p class="action-text">${day.action}</p>
                        </div>
                        
                        <div class="tips-section">
                            <h6><i class="fas fa-check-circle"></i> Action Tips:</h6>
                            <ul>
                                ${day.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="day-footer">
                            <div class="savings-info">
                                <i class="fas fa-piggy-bank"></i>
                                <span>Save ₹${day.savings_potential_inr} (${day.savings_percent}%)</span>
                            </div>
                            <div class="difficulty-info">
                                <i class="fas fa-clock"></i>
                                <span>${day.time_required} • ${day.difficulty}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                daysContainer.appendChild(dayCard);
            });
            
            container.appendChild(daysContainer);
        }
        
        // Display action plan
        if (advice7days.action_plan) {
            const planDiv = document.createElement('div');
            planDiv.className = 'action-plan-card';
            planDiv.innerHTML = `
                <h3><i class="fas fa-tasks"></i> Your Action Plan</h3>
                <div class="plan-stats">
                    <div class="plan-stat">
                        <span class="plan-number">${advice7days.action_plan.high_priority_count}</span>
                        <span class="plan-label">High Priority</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-number">${advice7days.action_plan.medium_priority_count}</span>
                        <span class="plan-label">Medium Priority</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-number">${advice7days.action_plan.estimated_time_investment_minutes}</span>
                        <span class="plan-label">Total Minutes</span>
                    </div>
                </div>
                
                <div class="quick-wins">
                    <h4>🎯 Quick Wins (Top 3)</h4>
                    ${advice7days.action_plan.quick_wins.map((win, idx) => `
                        <div class="quick-win-item">
                            <span class="win-number">${idx + 1}</span>
                            <div class="win-content">
                                <strong>${win.day}</strong>
                                <p>${win.action}</p>
                                <span class="win-savings">${win.savings}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(planDiv);
        }
    }
    
    async fetchAnalytics() {
        try {
            console.log('Fetching analytics...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/trends`);
            const data = await response.json();
            
            if (data.success) {
                this.updateAnalyticsDisplay(data);
            }
            
            // Fetch training history
            const historyResponse = await fetch(`${this.apiBaseUrl}/api/training-history`);
            const historyData = await historyResponse.json();
            
            if (historyData.success) {
                this.updateTrainingChart(historyData.history);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    }
    
    updateAnalyticsDisplay(data) {
        // Trends chart
        const trendsData = [{
            y: [data.trends.change_percentage || 2.5],
            x: [data.trends.period || 'Weekly'],
            type: 'bar',
            marker: { color: '#667eea' }
        }];
        
        const trendsLayout = {
            title: 'Consumption Trend',
            height: 300
        };
        
        Plotly.newPlot('trendsChart', trendsData, trendsLayout, {responsive: true});
        
        // Peak hours chart
        const peakHours = data.peak_hours;
        if (peakHours) {
            const peakData = [{
                x: ['Morning Peak', 'Evening Peak', 'Off-Peak'],
                y: [peakHours.morning_peak.length, peakHours.evening_peak.length, peakHours.off_peak.length],
                type: 'bar',
                marker: { 
                    color: ['#f5576c', '#ff6b6b', '#00b894']
                }
            }];
            
            const peakLayout = {
                title: 'Peak Hours Distribution',
                height: 300
            };
            
            Plotly.newPlot('peakHoursChart', peakData, peakLayout, {responsive: true});
        }
    }
    
    updateTrainingChart(history) {
        if (!history.loss || history.loss.length === 0) return;
        
        const epochs = Array.from({length: history.loss.length}, (_, i) => i + 1);
        
        const trace1 = {
            x: epochs,
            y: history.loss,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Training Loss',
            line: { color: '#667eea', width: 2 }
        };
        
        const trace2 = {
            x: epochs,
            y: history.val_loss || history.loss,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Validation Loss',
            line: { color: '#ff6b6b', width: 2 }
        };
        
        const layout = {
            title: 'Model Training Progress',
            xaxis: { title: 'Epoch' },
            yaxis: { title: 'Loss' },
            height: 350,
            font: {
                family: 'Segoe UI, sans-serif'
            }
        };
        
        Plotly.newPlot('trainingChart', [trace1, trace2], layout, {responsive: true});
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected panel
    document.getElementById(tabName).classList.add('active');
    
    // Activate clicked button
    event.target.classList.add('active');
    
    // Load data for the tab
    if (tabName === 'explanations') {
        dashboard.fetchExplanations();
    } else if (tabName === 'advice') {
        dashboard.fetchEnergyAdvice();
    } else if (tabName === 'analytics') {
        dashboard.fetchAnalytics();
    }
}

// Global functions for button clicks
function fetchPredictions(hours) {
    dashboard.fetchPredictions(hours);
}

function fetchExplanations() {
    dashboard.fetchExplanations();
}

function fetchEnergyAdvice() {
    dashboard.fetchEnergyAdvice();
}

function fetch7DayAdvice() {
    dashboard.fetch7DayAdvice();
}

function fetchAnalytics() {
    dashboard.fetchAnalytics();
}

// Initialize dashboard
let dashboard;

function initializeDashboard() {
    dashboard = new DashboardController();
    console.log('✅ Dashboard initialized successfully');
}