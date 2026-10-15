/**
 * PeerBridge Full-Stack API Client
 * Connects React Frontend to Express + MongoDB Backend with automatic JWT management
 * and graceful fallback.
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : 'http://localhost:5000/api';

const TOKEN_KEY = 'peerbridge_jwt_token_v1';

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error('Failed to save JWT token:', e);
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return data;
}

/**
 * Health check to detect if live backend is running
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (e) {
    return false;
  }
}

/**
 * Quick-switch simulated persona on the backend to obtain a valid JWT
 */
export async function switchDemoPersonaApi(identifier) {
  try {
    const data = await request('/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (err) {
    console.warn('Backend persona switch failed, continuing offline:', err.message);
    return null;
  }
}

/**
 * Fetch all missions with heuristic rankings from backend
 */
export async function fetchMissionsApi(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== 'All') searchParams.append('category', params.category);
  if (params.availabilityKey && params.availabilityKey !== 'All') searchParams.append('availabilityKey', params.availabilityKey);
  if (params.commitment && params.commitment !== 'All') searchParams.append('commitment', params.commitment);
  if (params.search) searchParams.append('search', params.search);
  if (params.hideFull) searchParams.append('hideFull', 'true');
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);

  const queryStr = searchParams.toString();
  return await request(`/missions${queryStr ? `?${queryStr}` : ''}`, { method: 'GET' });
}

/**
 * Create a new mission on the backend
 */
export async function createMissionApi(missionData) {
  return await request('/missions', {
    method: 'POST',
    body: JSON.stringify(missionData)
  });
}

/**
 * Join an existing mission circle
 */
export async function joinMissionApi(missionId) {
  return await request(`/missions/${missionId}/join`, {
    method: 'POST'
  });
}

/**
 * Leave a mission circle
 */
export async function leaveMissionApi(missionId) {
  return await request(`/missions/${missionId}/leave`, {
    method: 'POST'
  });
}

/**
 * Add a milestone task to mission checklist
 */
export async function addTaskApi(missionId, text) {
  return await request(`/missions/${missionId}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

/**
 * Toggle milestone task completed state
 */
export async function toggleTaskApi(taskId) {
  return await request(`/tasks/${taskId}/toggle`, {
    method: 'PATCH'
  });
}

/**
 * Delete a milestone task
 */
export async function deleteTaskApi(taskId) {
  return await request(`/tasks/${taskId}`, {
    method: 'DELETE'
  });
}

/**
 * Mark a mission completed or re-open
 */
export async function updateMissionStatusApi(missionId, status) {
  return await request(`/missions/${missionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}
