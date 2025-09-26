// js/api.js - API communication functions
const API_BASE_URL = 'http://localhost:5000/api';

class StudentAPI {
    static async getRecommendations(formData) {
        try {
            console.log('📤 Sending student data to backend API...', formData);
            
            const response = await fetch(`${API_BASE_URL}/student/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formatFormData(formData))
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'API returned unsuccessful response');
            }
            
            console.log('✅ Received recommendations:', data.recommendations.length, 'universities');
            return data.recommendations;
            
        } catch (error) {
            console.error('❌ API Request Failed:', error);
            throw new Error(`Failed to get recommendations: ${error.message}`);
        }
    }

    static formatFormData(formData) {
        // Convert frontend form data to backend format
        return {
            degreeLevel: formData.degreeLevel,
            fieldOfStudy: formData.fieldOfStudy,
            gpa: parseFloat(formData.gpa),
            budget: formData.budget,
            programType: formData.programType || 'any',
            destinationPreference: formData.destinationPreference || 'any',
            climatePreference: formData.climatePreference || 'any',
            scholarshipInterest: formData.scholarshipInterest || false,
            workImportance: formData.workImportance || 'moderate',
            visaImportance: formData.visaImportance || 'moderate',
            languageProficiency: formData.languageProficiency || 'none'
        };
    }

    static async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/student/health`, {
                method: 'GET',
                timeout: 5000 // 5 second timeout
            });
            
            if (!response.ok) {
                return false;
            }
            
            const data = await response.json();
            return data.status === 'healthy';
            
        } catch (error) {
            console.log('Health check failed:', error.message);
            return false;
        }
    }
}

// Add a fetch timeout polyfill
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const timeout = args[1]?.timeout || 8000; // Default 8 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    if (args[1]) {
        args[1].signal = controller.signal;
    } else {
        args[1] = { signal: controller.signal };
    }
    
    return originalFetch(...args).finally(() => clearTimeout(timeoutId));
};