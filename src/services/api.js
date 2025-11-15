import { API_BASE_URL } from '../utils/constants';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.isRefreshing = false;
        this.failedQueue = [];
    }

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Process failed queue
    processQueue(error, token = null) {
        this.failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        
        this.failedQueue = [];
    }

    // Helper method to handle responses with token refresh
    async handleResponse(response) {
        try {
            const data = await response.json();
            
            console.log('API Response:', data); // Debug log
            
            // Handle 401 Unauthorized - token expired
            if (response.status === 401) {
                if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    
                    try {
                        // Try to refresh the token
                        const refreshResponse = await fetch(`${this.baseURL}/auth/refresh-token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                        
                        const refreshData = await refreshResponse.json();
                        
                        if (refreshData.success) {
                            localStorage.setItem('token', refreshData.data.token);
                            this.processQueue(null, refreshData.data.token);
                            
                            // Retry the original request
                            const originalResponse = await fetch(response.url, {
                                ...response,
                                headers: this.getAuthHeaders()
                            });
                            
                            return originalResponse.json();
                        } else {
                            // Refresh failed, clear token and process queue with error
                            localStorage.removeItem('token');
                            this.processQueue(new Error('Token refresh failed'));
                            throw new Error('Session expired, please login again');
                        }
                    } catch (refreshError) {
                        localStorage.removeItem('token');
                        this.processQueue(refreshError);
                        throw refreshError;
                    } finally {
                        this.isRefreshing = false;
                    }
                } else {
                    // If already refreshing, add to queue
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    });
                }
            }
            
            if (!response.ok) {
                // Handle other HTTP errors
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Handle JSON parsing error
                throw new Error('Invalid response from server');
            }
            throw error;
        }
    }

    // Auth endpoints
    auth = {
        register: (data) => fetch(`${this.baseURL}api/auth/register`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        login: (data) => fetch(`${this.baseURL}api/auth/login`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        forgotPassword: (data) => fetch(`${this.baseURL}api/auth/forgot-password`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        verifyOTP: (data) => fetch(`${this.baseURL}api/auth/verify-otp`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                ...data, type: "email_verification"
            })
        }).then(this.handleResponse),

        resetPassword: (data) => fetch(`${this.baseURL}api/auth/reset-password`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        refreshToken: (data) => fetch(`${this.baseURL}api/auth/refresh-token`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        logout: () => fetch(`${this.baseURL}api/auth/logout`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        }).then(this.handleResponse),

        logoutAll: () => fetch(`${this.baseURL}api/auth/logout-all`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        }).then(this.handleResponse)
    };

    // User endpoints
    users = {
        getProfile: () => fetch(`${this.baseURL}/users/profile`, {
            headers: this.getAuthHeaders()
        }).then(this.handleResponse),

        updateProfile: (data) => fetch(`${this.baseURL}/users/profile`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        deleteAccount: () => fetch(`${this.baseURL}/users/account`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        }).then(this.handleResponse),

        changePassword: (data) => fetch(`${this.baseURL}/users/change-password`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        getStats: () => fetch(`${this.baseURL}/users/stats`, {
            headers: this.getAuthHeaders()
        }).then(this.handleResponse)
    };

    // Predictions endpoints
    predictions = {
        create: (data) => fetch(`${this.baseURL}/predictions`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(this.handleResponse),

        getHistory: () => fetch(`${this.baseURL}/predictions/history`, {
            headers: this.getAuthHeaders()
        }).then(this.handleResponse),

        getById: (id) => fetch(`${this.baseURL}/predictions/${id}`, {
            headers: this.getAuthHeaders()
        }).then(this.handleResponse),

        delete: (id) => fetch(`${this.baseURL}/predictions/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        }).then(this.handleResponse),

        archive: (id) => fetch(`${this.baseURL}/predictions/${id}/archive`, {
            method: 'PATCH',
            headers: this.getAuthHeaders()
        }).then(this.handleResponse)
    };
}

export default new ApiService();