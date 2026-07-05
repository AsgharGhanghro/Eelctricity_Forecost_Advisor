/**
 * Energy Intelligence Platform - Main Application Controller
 * Enterprise-grade energy prediction and optimization dashboard
 */

class EnergyApplication {
    constructor() {
        this.config = {
            apiBaseUrl: 'http://localhost:5000/api/v1',
            refreshInterval: 10000, // 10 seconds
            realtimeUpdate: 5000,   // 5 seconds
            cacheTTL: 300000        // 5 minutes
        };
        
        this.state = {
            isInitialized: false,
            apiConnected: false,
            lastUpdate: null,
            activePage: 'dashboard',
            notifications: [],
            alerts: [],
            predictions: [],
            liveData: null,
            advice: null,
            systemHealth: {
                api: 'unknown',
                model: 'unknown',
                database: 'unknown'
            }
        };
        
        this.components = {
            dashboard: null,
            charts: null,
            xai: null,
            advice: null,
            alerts: null
        };
        
        this.cache = new Map();
        this.websocket = null;
        this.intervalIds = [];
    }
    
    /**
     * Initialize the application
     */
    async initialize() {
        try {
            console.log('🚀 Initializing Energy Intelligence Platform...');
            
            // 1. Initialize components
            await this.initializeComponents();
            
            // 2. Check API connection
            await this.checkApiConnection();
            
            // 3. Setup event listeners
            this.setupEventListeners();
            
            // 4. Start periodic updates
            this.startPeriodicUpdates();
            
            // 5. Load initial data
            await this.loadInitialData();
            
            // 6. Update UI
            this.updateUI();
            
            this.state.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
            // Show welcome message
            this.showToast('Energy Intelligence Platform ready', 'success');
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.showToast('Initialization failed: ' + error.message, 'error');
        }
    }
    
    /**
     * Initialize all components
     */
    async initializeComponents() {
        // Initialize Dashboard Component
        this.components.dashboard = new DashboardComponent(this);
        
        // Initialize Charts Component
        this.components.charts = new ChartsComponent();
        
        // Initialize XAI Component
        this.components.xai = new XAIComponent();
        
        // Initialize Advice Component
        this.components.advice = new AdviceComponent();
        
        // Initialize Alerts Component
        this.components.alerts = new AlertsComponent();
        
        // Initialize 3D Visualization
        this.initialize3DVisualization();
        
        console.log('✅ Components initialized');
    }
    
    /**
     * Check API connection and system health
     */
    async checkApiConnection() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'operational') {
                this.state.apiConnected = true;
                this.state.systemHealth = {
                    api: 'healthy',
                    model: data.components?.model?.status || 'unknown',
                    database: data.components?.database || 'unknown'
                };
                
                this.updateSystemStatus('online');
                this.showToast('Connected to Energy Intelligence API', 'success');
                
                // Update model accuracy
                if (data.metrics?.accuracy) {
                    document.getElementById('predictionAccuracy').textContent = 
                        `${(data.metrics.accuracy * 100).toFixed(1)}%`;
                    document.getElementById('modelAccuracy').textContent = 
                        `${(data.metrics.accuracy * 100).toFixed(1)}%`;
                }
                
            } else {
                this.state.apiConnected = false;
                this.updateSystemStatus('offline');
                this.showToast('API service is degraded', 'warning');
            }
            
        } catch (error) {
            console.error('API connection error:', error);
            this.state.apiConnected = false;
            this.updateSystemStatus('error');
            this.showToast('Cannot connect to API server', 'error');
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Refresh button
        document.querySelector('[onclick*="forceRefresh"]').addEventListener('click', () => {
            this.forceRefresh();
        });
        
        // Export button
        document.querySelector('[onclick*="exportReport"]').addEventListener('click', () => {
            this.exportReport();
        });
        
        // Notification bell
        document.getElementById('notificationBell').addEventListener('click', () => {
            this.showNotifications();
        });
        
        // Real-time data refresh
        document.querySelector('[onclick*="refreshLiveData"]').addEventListener('click', () => {
            this.refreshLiveData();
        });
        
        console.log('✅ Event listeners setup complete');
    }
    
    /**
     * Start periodic updates
     */
    startPeriodicUpdates() {
        // Live data updates
        const liveDataInterval = setInterval(() => {
            if (this.state.apiConnected) {
                this.refreshLiveData();
            }
        }, this.config.realtimeUpdate);
        
        // System health check
        const healthCheckInterval = setInterval(() => {
            this.checkApiConnection();
        }, 60000); // Every minute
        
        // Data cache cleanup
        const cacheCleanupInterval = setInterval(() => {
            this.cleanupCache();
        }, 300000); // Every 5 minutes
        
        this.intervalIds.push(liveDataInterval, healthCheckInterval, cacheCleanupInterval);
        
        console.log('✅ Periodic updates started');
    }
    
    /**
     * Load initial data
     */
    async loadInitialData() {
        if (!this.state.apiConnected) {
            console.warn('⚠ API not connected, skipping initial data load');
            return;
        }
        
        try {
            // Load live data
            await this.refreshLiveData();
            
            // Load predictions
            await this.loadPredictions('24h');
            
            // Load explanations
            await this.getExplanations();
            
            // Load advice
            await this.getAdvice();
            
            // Load alerts
            await this.loadAlerts();
            
            console.log('✅ Initial data loaded');
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showToast('Error loading initial data', 'error');
        }
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        // Update last update time
        this.state.lastUpdate = new Date();
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Last update: ${this.formatTime(this.state.lastUpdate)}`;
        }
        
        // Update system status
        const apiStatusElement = document.getElementById('apiStatus');
        if (apiStatusElement) {
            const statusDot = apiStatusElement.querySelector('.status-dot');
            statusDot.className = 'status-dot ' + this.getSystemStatus();
        }
        
        // Update notification count
        const notificationCount = this.state.notifications.filter(n => !n.read).length;
        const notificationCountElement = document.querySelector('.notification-count');
        if (notificationCountElement) {
            notificationCountElement.textContent = notificationCount;
            notificationCountElement.style.display = notificationCount > 0 ? 'flex' : 'none';
        }
    }
    
    /**
     * Navigate to different page
     */
    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(pageElement => {
            pageElement.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.state.activePage = page;
            
            // Load page-specific data
            this.loadPageData(page);
        }
    }
    
    /**
     * Load page-specific data
     */
    async loadPageData(page) {
        switch (page) {
            case 'predictions':
                await this.loadAdvancedPredictions();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
            case 'advice':
                await this.loadAdvicePage();
                break;
            case 'alerts':
                await this.loadAlertsPage();
                break;
        }
    }
    
    /**
     * Force refresh all data
     */
    async forceRefresh() {
        this.showToast('Refreshing all data...', 'info');
        
        // Clear cache
        this.cache.clear();
        
        // Reload all data
        await this.checkApiConnection();
        await this.refreshLiveData();
        await this.loadPredictions('24h');
        await this.getExplanations();
        await this.getAdvice();
        
        this.showToast('Data refreshed successfully', 'success');
    }
    
    /**
     * Refresh live data
     */
    async refreshLiveData() {
        try {
            const cacheKey = 'liveData';
            const cached = this.getCachedData(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < 10000) {
                // Use cached data if less than 10 seconds old
                this.updateLiveDataDisplay(cached.data);
                return cached.data;
            }
            
            const response = await fetch(`${this.config.apiBaseUrl}/monitor/real-time`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                // Cache the data
                this.cacheData(cacheKey, data.data);
                
                // Update display
                this.updateLiveDataDisplay(data.data);
                
                // Check for new alerts
                if (data.alerts && data.alerts.length > 0) {
                    this.processNewAlerts(data.alerts);
                }
                
                // Check for anomalies
                if (data.anomalies && data.anomalies.length > 0) {
                    this.processAnomalies(data.anomalies);
                }
                
                return data.data;
            }
            
        } catch (error) {
            console.error('Error refreshing live data:', error);
            // Don't show toast for network errors during periodic updates
            if (!this.state.lastUpdate || Date.now() - this.state.lastUpdate.getTime() > 30000) {
                this.showToast('Error updating live data', 'error');
            }
        }
    }
    
    /**
     * Update live data display
     */
    updateLiveDataDisplay(data) {
        // Update current usage
        const currentUsage = data.current_consumption_kw || 0;
        document.getElementById('currentUsage').textContent = `${currentUsage.toFixed(1)} kW`;
        
        // Update today's cost (simplified calculation)
        const hourlyCost = currentUsage * 8; // ₹8 per kWh
        const todayCost = hourlyCost * new Date().getHours();
        document.getElementById('todayCost').textContent = `₹ ${todayCost.toFixed(2)}`;
        
        // Update gauge
        this.updateConsumptionGauge(currentUsage);
        
        // Update component breakdown
        this.updateComponentBreakdown(data.components);
        
        // Update live chart
        if (this.components.charts) {
            this.components.charts.updateLiveChart(data);
        }
        
        // Update 3D visualization
        this.update3DVisualization(data);
        
        // Update timestamp
        this.state.lastUpdate = new Date();
        this.updateUI();
    }
    
    /**
     * Update consumption gauge
     */
    updateConsumptionGauge(consumption) {
        const gauge = document.querySelector('.gauge');
        const gaugeValue = document.querySelector('.gauge-value');
        
        if (gauge && gaugeValue) {
            // Update value
            gaugeValue.textContent = consumption.toFixed(1);
            
            // Update gauge color based on consumption
            let percentage;
            if (consumption < 1.5) {
                percentage = (consumption / 1.5) * 30;
                gauge.style.background = `conic-gradient(
                    var(--secondary-color) 0% ${percentage}%,
                    var(--warning-color) ${percentage}% 30%,
                    var(--danger-color) 30% 100%
                )`;
            } else if (consumption < 2.5) {
                percentage = 30 + ((consumption - 1.5) / 1.0) * 40;
                gauge.style.background = `conic-gradient(
                    var(--secondary-color) 0% 30%,
                    var(--warning-color) 30% ${percentage}%,
                    var(--danger-color) ${percentage}% 100%
                )`;
            } else {
                percentage = 70 + ((consumption - 2.5) / 2.5) * 30;
                percentage = Math.min(percentage, 100);
                gauge.style.background = `conic-gradient(
                    var(--secondary-color) 0% 30%,
                    var(--warning-color) 30% 70%,
                    var(--danger-color) 70% ${percentage}%
                )`;
            }
        }
    }
    
    /**
     * Update component breakdown
     */
    updateComponentBreakdown(components) {
        const componentsList = document.getElementById('componentsList');
        if (!componentsList || !components) return;
        
        const componentColors = {
            'ac_bedroom': '#ff4757',
            'ac_living_room': '#ffa502',
            'kitchen': '#2ed573',
            'living_room': '#1e90ff',
            'ups': '#ff6b81',
            'other_ac': '#a55eea',
            'lighting': '#f78fb3'
        };
        
        componentsList.innerHTML = '';
        
        Object.entries(components).forEach(([name, value]) => {
            const item = document.createElement('div');
            item.className = 'component-item';
            
            item.innerHTML = `
                <div class="component-name">
                    <span class="component-color" style="background: ${componentColors[name] || '#ccc'}"></span>
                    <span>${this.formatComponentName(name)}</span>
                </div>
                <div class="component-value">${value.toFixed(2)} kW</div>
            `;
            
            componentsList.appendChild(item);
        });
    }
    
    /**
     * Load predictions
     */
    async loadPredictions(range = '24h') {
        try {
            const hours = this.parseRangeToHours(range);
            const cacheKey = `predictions_${hours}`;
            const cached = this.getCachedData(cacheKey);
            
            if (cached) {
                this.updatePredictionsDisplay(cached.data);
                return cached.data;
            }
            
            const response = await fetch(`${this.config.apiBaseUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    horizon: hours,
                    confidence: 0.95,
                    include_components: true
                })
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                // Cache the data
                this.cacheData(cacheKey, data.predictions);
                
                // Update display
                this.updatePredictionsDisplay(data.predictions);
                
                return data.predictions;
            }
            
        } catch (error) {
            console.error('Error loading predictions:', error);
            this.showToast('Error loading predictions', 'error');
        }
    }
    
    /**
     * Update predictions display
     */
    updatePredictionsDisplay(predictions) {
        if (!predictions || predictions.length === 0) return;
        
        // Calculate statistics
        const totalEnergy = predictions.reduce((sum, p) => sum + p.total_consumption, 0);
        const peakConsumption = Math.max(...predictions.map(p => p.total_consumption));
        const estimatedCost = totalEnergy * 8; // ₹8 per kWh
        
        // Update summary
        document.getElementById('peakForecast').textContent = `${peakConsumption.toFixed(1)} kW`;
        document.getElementById('totalEnergy').textContent = `${totalEnergy.toFixed(1)} kWh`;
        document.getElementById('estimatedCost').textContent = `₹ ${estimatedCost.toFixed(2)}`;
        
        // Update confidence intervals
        const firstPrediction = predictions[0];
        if (firstPrediction.confidence_interval) {
            document.getElementById('ciLower').textContent = 
                `${firstPrediction.confidence_interval.lower.toFixed(1)} kW`;
            document.getElementById('ciUpper').textContent = 
                `${firstPrediction.confidence_interval.upper.toFixed(1)} kW`;
        }
        
        // Update chart
        if (this.components.charts) {
            this.components.charts.updatePredictionChart(predictions);
        }
        
        // Store in state
        this.state.predictions = predictions;
    }
    
    /**
     * Get AI explanations
     */
    async getExplanations() {
        try {
            const cacheKey = 'explanations';
            const cached = this.getCachedData(cacheKey);
            
            if (cached) {
                this.updateExplanationsDisplay(cached.data);
                return cached.data;
            }
            
            const response = await fetch(`${this.config.apiBaseUrl}/explain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method: 'shap',
                    top_features: 5
                })
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                // Cache the data
                this.cacheData(cacheKey, data.explanations);
                
                // Update display
                this.updateExplanationsDisplay(data.explanations);
                
                return data.explanations;
            }
            
        } catch (error) {
            console.error('Error getting explanations:', error);
            this.showToast('Error getting AI explanations', 'error');
        }
    }
    
    /**
     * Update explanations display
     */
    updateExplanationsDisplay(explanations) {
        if (!explanations) return;
        
        // Update feature importance chart
        if (explanations.feature_importance && this.components.xai) {
            this.components.xai.updateFeatureImportanceChart(explanations.feature_importance);
        }
        
        // Update insights list
        const insightsList = document.getElementById('insightsList');
        if (insightsList && explanations.key_factors) {
            insightsList.innerHTML = '';
            
            explanations.key_factors.forEach(factor => {
                const insight = document.createElement('div');
                insight.className = 'insight-item';
                insight.innerHTML = `
                    <strong>${factor.factor}</strong> (${factor.impact})
                    <br><small>${factor.explanation}</small>
                `;
                insightsList.appendChild(insight);
            });
        }
    }
    
    /**
     * Get energy advice
     */
    async getAdvice() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/advice?days=7&customer_type=enterprise`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                // Update display
                this.updateAdviceDisplay(data);
                
                // Store in state
                this.state.advice = data;
                
                return data;
            }
            
        } catch (error) {
            console.error('Error getting advice:', error);
            this.showToast('Error getting energy advice', 'error');
        }
    }
    
    /**
     * Update advice display
     */
    updateAdviceDisplay(advice) {
        if (!advice) return;
        
        // Update savings estimate
        const savingsElement = document.getElementById('potentialSavings');
        if (savingsElement && advice.savings_estimate) {
            savingsElement.textContent = `₹ ${advice.savings_estimate.weekly.toFixed(2)}`;
        }
        
        // Update advice list
        const adviceList = document.getElementById('adviceList');
        if (adviceList && advice.recommendations) {
            adviceList.innerHTML = '';
            
            advice.recommendations.slice(0, 3).forEach(rec => {
                const item = document.createElement('div');
                item.className = 'advice-item';
                item.innerHTML = `
                    <div class="advice-icon">💡</div>
                    <div class="advice-content">
                        <div class="advice-title">${rec.title || 'Recommendation'}</div>
                        <div class="advice-savings">Potential savings: ${rec.savings || '--'}</div>
                    </div>
                `;
                adviceList.appendChild(item);
            });
        }
    }
    
    /**
     * Load alerts
     */
    async loadAlerts() {
        try {
            // In a real implementation, this would fetch from /api/v1/alerts
            // For now, we'll simulate with the real-time data
            
            const response = await fetch(`${this.config.apiBaseUrl}/monitor/real-time`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success && data.alerts) {
                this.updateAlertsDisplay(data.alerts);
                return data.alerts;
            }
            
        } catch (error) {
            console.error('Error loading alerts:', error);
        }
    }
    
    /**
     * Update alerts display
     */
    updateAlertsDisplay(alerts) {
        if (!alerts) return;
        
        const alertsList = document.getElementById('alertsList');
        const alertCount = document.getElementById('alertCount');
        
        if (!alertsList) return;
        
        // Update count
        if (alertCount) {
            alertCount.textContent = alerts.length;
            alertCount.style.display = alerts.length > 0 ? 'flex' : 'none';
        }
        
        // Update list
        alertsList.innerHTML = '';
        
        alerts.slice(0, 3).forEach(alert => {
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.innerHTML = `
                <div class="alert-icon">🚨</div>
                <div class="alert-content">
                    <div class="alert-title">${alert.type || 'Alert'}</div>
                    <div class="alert-time">${this.formatTime(new Date(alert.timestamp))}</div>
                </div>
            `;
            alertsList.appendChild(item);
        });
        
        // Store in state
        this.state.alerts = alerts;
    }
    
    /**
     * Process new alerts
     */
    processNewAlerts(newAlerts) {
        // Check if any alerts are new
        const existingAlertIds = this.state.alerts.map(a => a.id || a.timestamp);
        const trulyNewAlerts = newAlerts.filter(alert => 
            !existingAlertIds.includes(alert.id || alert.timestamp)
        );
        
        if (trulyNewAlerts.length > 0) {
            // Add to notifications
            trulyNewAlerts.forEach(alert => {
                this.addNotification({
                    type: 'alert',
                    title: alert.type || 'New Alert',
                    message: alert.message || 'A new alert has been detected',
                    timestamp: alert.timestamp || new Date().toISOString(),
                    read: false
                });
            });
            
            // Update alerts list
            this.state.alerts = [...this.state.alerts, ...trulyNewAlerts];
            this.updateAlertsDisplay(this.state.alerts);
            
            // Show toast for important alerts
            if (trulyNewAlerts.some(a => a.level === 'alert' || a.level === 'critical')) {
                this.showToast('New critical alert detected', 'error');
            }
        }
    }
    
    /**
     * Process anomalies
     */
    processAnomalies(anomalies) {
        if (anomalies && anomalies.length > 0) {
            anomalies.forEach(anomaly => {
                this.addNotification({
                    type: 'anomaly',
                    title: 'Consumption Anomaly',
                    message: `Unusual consumption pattern detected: ${anomaly.deviation.toFixed(2)} deviation`,
                    timestamp: anomaly.timestamp || new Date().toISOString(),
                    read: false
                });
            });
        }
    }
    
    /**
     * Add notification
     */
    addNotification(notification) {
        this.state.notifications.unshift(notification);
        this.updateUI();
    }
    
    /**
     * Show notifications
     */
    showNotifications() {
        // In a real implementation, this would open a notifications modal
        const unreadCount = this.state.notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            // Mark all as read
            this.state.notifications.forEach(n => n.read = true);
            this.updateUI();
            
            this.showToast(`Marked ${unreadCount} notifications as read`, 'info');
        } else {
            this.showToast('No new notifications', 'info');
        }
    }
    
    /**
     * Export report
     */
    async exportReport() {
        try {
            this.showToast('Generating report...', 'info');
            
            // Collect data for report
            const reportData = {
                timestamp: new Date().toISOString(),
                systemHealth: this.state.systemHealth,
                currentConsumption: this.state.liveData?.current_consumption_kw,
                predictions: this.state.predictions?.slice(0, 24),
                advice: this.state.advice,
                alerts: this.state.alerts
            };
            
            // Create downloadable JSON
            const dataStr = JSON.stringify(reportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            // Create download link
            const exportFileDefaultName = `energy_report_${new Date().toISOString().slice(0, 10)}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            this.showToast('Report exported successfully', 'success');
            
        } catch (error) {
            console.error('Error exporting report:', error);
            this.showToast('Error exporting report', 'error');
        }
    }
    
    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    /**
     * Update system status indicator
     */
    updateSystemStatus(status) {
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            statusDot.className = 'status-dot';
            switch (status) {
                case 'online':
                    statusDot.classList.add('online');
                    statusDot.title = 'System online';
                    break;
                case 'offline':
                    statusDot.style.background = '#ff4757';
                    statusDot.title = 'System offline';
                    break;
                case 'error':
                    statusDot.style.background = '#ff4757';
                    statusDot.style.animation = 'none';
                    statusDot.title = 'System error';
                    break;
            }
        }
    }
    
    /**
     * Get current system status
     */
    getSystemStatus() {
        if (!this.state.apiConnected) return 'error';
        if (this.state.systemHealth.api === 'healthy') return 'online';
        return 'offline';
    }
    
    /**
     * Cache data with timestamp
     */
    cacheData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    /**
     * Get cached data if not expired
     */
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.config.cacheTTL) {
            this.cache.delete(key);
            return null;
        }
        
        return cached;
    }
    
    /**
     * Cleanup expired cache entries
     */
    cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.config.cacheTTL) {
                this.cache.delete(key);
            }
        }
    }
    
    /**
     * Format component name
     */
    formatComponentName(name) {
        const nameMap = {
            'ac_bedroom': 'Bedroom AC',
            'ac_living_room': 'Living Room AC',
            'kitchen': 'Kitchen',
            'living_room': 'Living Room',
            'ups': 'UPS',
            'other_ac': 'Other AC',
            'lighting': 'Lighting'
        };
        
        return nameMap[name] || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    /**
     * Format time
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
    
    /**
     * Parse range string to hours
     */
    parseRangeToHours(range) {
        const ranges = {
            '24h': 24,
            '48h': 48,
            '7d': 168,
            '30d': 720
        };
        
        return ranges[range] || 24;
    }
    
    /**
     * Initialize 3D visualization
     */
    initialize3DVisualization() {
        // This would initialize the Three.js scene
        // For now, we'll create a placeholder
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ccc;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🏢</div>
                        <div>3D Energy Flow Visualization</div>
                        <div style="font-size: 12px; color: #888; margin-top: 8px;">Enterprise Feature</div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Update 3D visualization
     */
    update3DVisualization(data) {
        // This would update the Three.js visualization with new data
        // For now, we'll update the placeholder
        const threeContainer = document.getElementById('three-container');
        if (threeContainer && data) {
            const consumption = data.current_consumption_kw || 0;
            let status = 'Normal';
            let color = '#2ed573';
            
            if (consumption > 2.5) {
                status = 'High Load';
                color = '#ff4757';
            } else if (consumption > 1.5) {
                status = 'Medium Load';
                color = '#ffa502';
            }
            
            threeContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🏢</div>
                        <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: ${color}">
                            ${consumption.toFixed(1)} kW
                        </div>
                        <div style="font-size: 14px; color: #ccc;">${status}</div>
                        <div style="font-size: 12px; color: #888; margin-top: 16px;">
                            Last updated: ${this.formatTime(new Date())}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Advanced predictions page
     */
    async loadAdvancedPredictions() {
        // Implementation for advanced predictions page
        console.log('Loading advanced predictions...');
    }
    
    /**
     * Analytics page
     */
    async loadAnalytics() {
        // Implementation for analytics page
        console.log('Loading analytics...');
    }
    
    /**
     * Advice page
     */
    async loadAdvicePage() {
        // Implementation for advice page
        console.log('Loading advice page...');
    }
    
    /**
     * Alerts page
     */
    async loadAlertsPage() {
        // Implementation for alerts page
        console.log('Loading alerts page...');
    }
}

// Make globally accessible
window.EnergyApp = EnergyApplication;