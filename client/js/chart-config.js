// Chart Configuration and Utilities
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultConfig = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: { size: 12 },
                    bodyFont: { size: 11 },
                    padding: 10,
                    cornerRadius: 6
                }
            }
        };
    }
    
    createLiveChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || [],
                datasets: [{
                    label: 'Live Consumption (kW)',
                    data: data.values || [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#667eea'
                }]
            },
            options: {
                ...this.defaultConfig,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#636e72' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#636e72' }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    createPredictionChart(canvasId, predictions) {
        const timestamps = predictions.map(p => {
            const date = new Date(p.timestamp);
            return `${date.getHours()}:00`;
        });
        
        const usages = predictions.map(p => p.predicted_usage_kw);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Predicted Usage (kW)',
                    data: usages,
                    backgroundColor: usages.map(value => 
                        value > 2.5 ? '#ff6b6b' :
                        value > 1.5 ? '#fdcb6e' : '#4ecdc4'
                    ),
                    borderColor: usages.map(value => 
                        value > 2.5 ? '#ff4757' :
                        value > 1.5 ? '#eccc68' : '#2ed573'
                    ),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                ...this.defaultConfig,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { 
                            color: '#636e72',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#636e72' },
                        title: {
                            display: true,
                            text: 'Usage (kW)',
                            color: '#636e72'
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    createFeatureImportanceChart(canvasId, featureImportance) {
        const features = Object.keys(featureImportance);
        const importance = Object.values(featureImportance);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: features,
                datasets: [{
                    label: 'Importance Score',
                    data: importance,
                    backgroundColor: importance.map(value => 
                        value > 0.3 ? '#ff6b6b' :
                        value > 0.15 ? '#fdcb6e' : '#4ecdc4'
                    ),
                    borderColor: importance.map(value => 
                        value > 0.3 ? '#ff4757' :
                        value > 0.15 ? '#eccc68' : '#2ed573'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                ...this.defaultConfig,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#636e72' },
                        max: 0.5
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#636e72' }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    createTrainingHistoryChart(canvasId, history) {
        const epochs = Array.from({length: history.loss.length}, (_, i) => i + 1);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: epochs,
                datasets: [
                    {
                        label: 'Training Loss',
                        data: history.loss,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Validation Loss',
                        data: history.val_loss || [],
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                ...this.defaultConfig,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch',
                            color: '#636e72'
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#636e72' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Loss',
                            color: '#636e72'
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { color: '#636e72' }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    createDonutChart(canvasId, data, labels) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#667eea', '#764ba2', '#4ecdc4', '#ff6b6b', 
                        '#fdcb6e', '#45b7d1', '#96ceb4', '#ff9ff3'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                ...this.defaultConfig,
                cutout: '60%',
                plugins: {
                    ...this.defaultConfig.plugins,
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;
        
        chart.data.datasets[0].data = newData;
        chart.update('active');
    }
    
    addDataPoint(canvasId, newPoint) {
        const chart = this.charts.get(canvasId);
        if (!chart) return;
        
        chart.data.labels.push(newPoint.label || '');
        chart.data.datasets[0].data.push(newPoint.value);
        
        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update('active');
    }
    
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }
    
    createSparkline(canvasId, data, color = '#667eea') {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: data.length}, (_, i) => ''),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
}

// Create global chart manager
const chartManager = new ChartManager();

// Export for global use
window.chartManager = chartManager;