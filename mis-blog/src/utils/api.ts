const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("adminToken");
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: headers as HeadersInit,
      });

      if (!response.ok) {
        let errorMessage = "Network error";
        try {
          const error = await response.json();
          errorMessage =
            error.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `HTTP ${response.status}: ${
            response.statusText || "Network error"
          }`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors (server not running, CORS, etc.)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to server. Make sure the backend is running on http://localhost:5000"
        );
      }
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  },
};


