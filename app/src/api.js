// app/src/api.js
// Change BACKEND to your machine's LAN IP when testing on a physical device
// e.g. const BACKEND = 'http://192.168.1.100:4000';
const BACKEND = 'http://localhost:4000';

// Helper: calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function safeFetch(url, opts = {}) {
  try {
    console.log(`[API] ${opts.method || 'GET'} ${url}`);
    const res = await fetch(url, opts);
    const contentType = res.headers.get('content-type');
    
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      const errMsg = `Request failed ${res.status} ${res.statusText} ${text ? '- ' + text : ''}`;
      console.error(`[API Error] ${errMsg}`);
      throw new Error(errMsg);
    }
    
    // Handle JSON response
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      console.log(`[API Response] Success:`, data);
      return data;
    }
    
    // Handle text response (HTML, etc)
    const text = await res.text();
    console.log(`[API Response] Text response received`);
    return { success: true, data: text };
  } catch (error) {
    console.error(`[API Fatal Error] ${error.message}`);
    throw error;
  }
}

export async function fetchNearest(lat, lng, limit = 5) {
  try {
    const url = `${BACKEND}/api/pharmacies?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&limit=${encodeURIComponent(limit)}`;
    const response = await safeFetch(url);
    
    // Handle both success: true format and direct array format
    let data = [];
    if (response.success && Array.isArray(response.data)) {
      data = response.data;
    } else if (Array.isArray(response)) {
      data = response;
    }
    
    // Calculate distances on frontend as fallback if not provided by backend
    const enriched = data.map(item => ({
      ...item,
      distance_km: item.distance_km || calculateDistance(lat, lng, item.latitude || 0, item.longitude || 0)
    }));
    
    // Sort by distance
    enriched.sort((a, b) => a.distance_km - b.distance_km);
    
    return enriched.slice(0, limit);
  } catch (error) {
    console.error('[fetchNearest Error]', error);
    throw error;
  }
}

export async function fetchAll() {
  try {
    const url = `${BACKEND}/api/pharmacies`;
    const response = await safeFetch(url);
    
    // Handle both success: true format and direct array format
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('[fetchAll Error]', error);
    throw error;
  }
}

export async function createPharmacy(payload) {
  try {
    const response = await safeFetch(`${BACKEND}/api/pharmacies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Handle response format
    if (response.success && response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('[createPharmacy Error]', error);
    throw error;
  }
}

export async function updatePharmacy(id, payload) {
  try {
    const response = await safeFetch(`${BACKEND}/api/pharmacies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Handle response format
    if (response.success && response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('[updatePharmacy Error]', error);
    throw error;
  }
}

export async function deletePharmacy(id) {
  try {
    const response = await safeFetch(`${BACKEND}/api/pharmacies/${id}`, { 
      method: 'DELETE' 
    });
    
    // Handle response format
    if (response.success) {
      return response;
    }
    return response;
  } catch (error) {
    console.error('[deletePharmacy Error]', error);
    throw error;
  }
}

// Health check - can be called to verify backend is running
export async function checkBackendHealth() {
  try {
    const response = await safeFetch(`${BACKEND}/health`);
    return response;
  } catch (error) {
    console.error('[Health Check Error]', error);
    return { success: false, message: 'Backend is not responding' };
  }
}
