class ApiService {
  static instance = null;

  constructor() {
    if (ApiService.instance) {
      return ApiService.instance;
    }

    this.baseURL = 'http://localhost:3002';
    this.headers = {
      'Content-Type': 'application/json'
    };
    this.requestCount = 0;

    ApiService.instance = this;
  }

  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get(endpoint) {
    this.requestCount++;
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.headers
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error en GET ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint, data) {
    this.requestCount++;
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error);
      throw error;
    }
  }

  async put(endpoint, data) {
    this.requestCount++;
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error);
      throw error;
    }
  }

  getRequestCount() {
    return this.requestCount;
  }
}

// Exportar instancia única del Singleton
export const apiService = ApiService.getInstance();
