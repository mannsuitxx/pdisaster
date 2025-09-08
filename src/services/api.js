// src/services/api.js

const API_BASE_URL = "http://localhost:5000/api";
const PROD_URL = "https://pdisaster-8vys.onrender.com/api";

// Auto-select environment
const isProduction = window.location.hostname !== "localhost";
const BASE_URL = isProduction ? PROD_URL : API_BASE_URL;

class ApiService {
  constructor() {
    this.token = localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null; // no body
      }

      if (!response.ok) {
        console.error("API Response Error:", data);
        throw new Error(
          data?.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  }

  // ---------- Auth ----------
  async login(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data?.token) this.setToken(data.token);
    return data; // { message, token, user }
  }

  async register(userData) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: userData,
    });
    if (data?.token) this.setToken(data.token);
    return data; // { message, token, user }
  }

  async logout() {
    this.removeToken();
  }

  async me() {
    return this.request("/auth/me");
  }

  // ---------- Modules ----------
  async getModules(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/modules${params.toString() ? `?${params}` : ""}`);
  }

  async getModule(id) {
    return this.request(`/modules/${id}`);
  }

  async completeModule(id, data) {
    return this.request(`/modules/${id}/complete`, {
      method: "POST",
      body: data,
    });
  }

  // ---------- Games ----------
  async getGames(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/games${params.toString() ? `?${params}` : ""}`);
  }

  async getGame(id) {
    return this.request(`/games/${id}`);
  }

  async submitGameScore(id, scoreData) {
    return this.request(`/games/${id}/score`, {
      method: "POST",
      body: scoreData,
    });
  }

  async getGameLeaderboard(id) {
    return this.request(`/games/${id}/leaderboard`);
  }

  // ---------- Drills ----------
  async getDrills() {
    return this.request("/drills");
  }

  async getDrill(id) {
    return this.request(`/drills/${id}`);
  }

  async completeDrill(id, data) {
    return this.request(`/drills/${id}/complete`, {
      method: "POST",
      body: data,
    });
  }

  // ---------- Emergency ----------
  async getEmergencyContacts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/emergency/contacts${params.toString() ? `?${params}` : ""}`);
  }

  async getDisasterAlerts(region = "all") {
    return this.request(`/emergency/alerts?region=${region}`);
  }

  // ---------- Admin ----------
  async getAdminDashboard() {
    return this.request("/admin/dashboard");
  }

  async getAdminReports(type, period) {
    return this.request(`/admin/reports?type=${type}&period=${period}`);
  }

  async scheduleDrill(drillData) {
    return this.request("/admin/drills/schedule", {
      method: "POST",
      body: drillData,
    });
  }
}

export default new ApiService();
