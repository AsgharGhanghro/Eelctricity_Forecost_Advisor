// API Client for Backend Communication
class APIClient {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
    
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'error', message: error.message };
        }
    }
    
    async getPredictions(hours = 24, mode = 'future', features = null) {
        try {
            const payload = { mode, hours };
            if (features) payload.features = features;
            
            const response = await fetch(`${this.baseURL}/api/predict`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Prediction request failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getExplanations(inputData = null) {
        try {
            const payload = {};
            if (inputData) payload.input_data = inputData;
            
            const response = await fetch(`${this.baseURL}/api/explain`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Explanation request failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getEnergyAdvice() {
        try {
            const response = await fetch(`${this.baseURL}/api/advice`);
            return await response.json();
        } catch (error) {
            console.error('Advice request failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getLiveData() {
        try {
            const response = await fetch(`${this.baseURL}/api/live-data`);
            return await response.json();
        } catch (error) {
            console.error('Live data request failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getTrainingHistory() {
        try {
            const response = await fetch(`${this.baseURL}/api/training-history`);
            return await response.json();
        } catch (error) {
            console.error('Training history request failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getFeatures() {
        try {
            const response = await fetch(`${this.baseURL}/api/features`);
            return await response.json();
        } catch (error) {
            console.error('Features request failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async sendFeedback(predictionId, feedback) {
        try {
            const response = await fetch(`${this.baseURL}/api/feedback`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ predictionId, feedback })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Feedback submission failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global API client instance
const apiClient = new APIClient();

// Export for use in other modules
window.apiClient = apiClient;