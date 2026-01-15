const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    return {};
};

export const api = {
    async get(endpoint) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: { ...getAuthHeaders() }
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },

    async post(endpoint, body) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },
    
    async patch(endpoint, body) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw await res.json();
        return res.json();
    }
};
