import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

export const api = {
  get: async (endpoint: string) => {
    const token = Cookies.get("token");

    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error en GET " + endpoint);
    }

    return res.json();
  },

  post: async (endpoint: string, data: any) => {
    const token = Cookies.get("token");

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error en POST " + endpoint);
    }

    return res.json();
  },

  put: async (endpoint: string, data: any) => {
    const token = Cookies.get("token");

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error en PUT " + endpoint);
    }

    return res.json();
  },

  delete: async (endpoint: string) => {
    const token = Cookies.get("token");

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error en DELETE " + endpoint);
    }

    return res.json();
  },
};