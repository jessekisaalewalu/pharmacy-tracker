// api.js - API communication with backend
const BACKEND = 'http://localhost:4000';

class PharmacyAPI {
    constructor(baseURL = BACKEND) {
        this.baseURL = baseURL;
    }

    /**
     * Safely fetch with error handling
     */
    async safeFetch(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const text = await response.text().catch(() => null);
                throw new Error(`Request failed ${response.status} ${response.statusText} ${text ? '- ' + text : ''}`);
            }
            return await response.json().catch(() => ({}));
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Fetch all pharmacies or search by name
     */
    async fetchAll(search = null) {
        let url = `${this.baseURL}/api/pharmacies`;
        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }
        return this.safeFetch(url);
    }

    /**
     * Fetch nearest pharmacies to a location
     * @param {number} lat - User's latitude
     * @param {number} lng - User's longitude
     * @param {number} limit - Number of results to return (default: 5)
     */
    async fetchNearest(lat, lng, limit = 5) {
        const url = `${this.baseURL}/api/pharmacies?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&limit=${encodeURIComponent(limit)}`;
        return this.safeFetch(url);
    }

    /**
     * Get a single pharmacy by ID
     */
    async getPharmacy(id) {
        const url = `${this.baseURL}/api/pharmacies/${id}`;
        return this.safeFetch(url);
    }

    /**
     * Create a new pharmacy
     */
    async createPharmacy(payload) {
        return this.safeFetch(`${this.baseURL}/api/pharmacies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    /**
     * Update an existing pharmacy
     */
    async updatePharmacy(id, payload) {
        return this.safeFetch(`${this.baseURL}/api/pharmacies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    /**
     * Delete a pharmacy
     */
    async deletePharmacy(id) {
        return this.safeFetch(`${this.baseURL}/api/pharmacies/${id}`, {
            method: 'DELETE'
        });
    }
}

// Create global API instance
const api = new PharmacyAPI();
