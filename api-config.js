// Backend API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to set auth token
function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// Helper function to remove auth token
function removeAuthToken() {
    localStorage.removeItem('token');
}

// Helper function to make API calls with authentication
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API Error');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication APIs
const authAPI = {
    login: (email, password) => apiCall('/auth/login', 'POST', { email, password }),
    register: (name, email, password) => apiCall('/auth/register', 'POST', { name, email, password }),
};

// User APIs
const userAPI = {
    getProfile: () => apiCall('/user/profile', 'GET'),
    updateProfile: (data) => apiCall('/user/profile', 'PUT', data),
};

// Cart APIs
const cartAPI = {
    getCart: () => apiCall('/cart', 'GET'),
    addToCart: (productId, quantity) => apiCall('/cart/add', 'POST', { productId, quantity }),
    removeFromCart: (productId) => apiCall('/cart/remove', 'POST', { productId }),
    updateCart: (productId, quantity) => apiCall('/cart/update', 'PUT', { productId, quantity }),
};

// Order APIs
const orderAPI = {
    getOrders: () => apiCall('/orders', 'GET'),
    createOrder: (data) => apiCall('/orders/create', 'POST', data),
    getOrderDetails: (orderId) => apiCall(`/orders/${orderId}`, 'GET'),
};
