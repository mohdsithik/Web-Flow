// Centralized script for handling auth token and API calls

//http://127.0.0.1:5500/ApiCall.js

const apiConfig = {
    refreshEndpoint: 'http://localhost:3000/auth/refresh-token',
    loginEndpoint:'http://localhost:3000/auth/login',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    grantType: 'refresh_token'
  };
  
  function saveTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  
  function getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
  
  function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
  
    const response = await fetch(apiConfig.refreshEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });
  
    if (!response.ok) {
      clearTokens();
      throw new Error('Failed to refresh token');
    }
  
    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token);
    return data.access_token;
  }
  
  async function makeAuthenticatedRequest(endpoint, options = {}) {
    let accessToken = getAccessToken();
    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }
  
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    });
  
    if (response.status === 401) {
      accessToken = await refreshAccessToken();
      return fetch(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`
        }
      });
    }
  
    return response;
  }

  async function loginUser(email, password) {
    const response = await fetch(apiConfig.loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: apiConfig.clientId,
        client_secret: apiConfig.clientSecret,
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token);
    return data;
  }
