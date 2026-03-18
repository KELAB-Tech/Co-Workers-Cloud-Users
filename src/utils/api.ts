import { getToken } from "@/utils/auth";

export const API_URL = "https://backend-co-workers-cloud.onrender.com/api";

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Error ${res.status}`);
  }

  return data;
};

export const api = {
  get:    (endpoint: string)              => request(endpoint),
  post:   (endpoint: string, data: any)  => request(endpoint, { method: "POST",   body: JSON.stringify(data) }),
  put:    (endpoint: string, data: any)  => request(endpoint, { method: "PUT",    body: JSON.stringify(data) }),
  patch:  (endpoint: string, data?: any) => request(endpoint, { method: "PATCH",  body: data ? JSON.stringify(data) : undefined }),
  delete: (endpoint: string)             => request(endpoint, { method: "DELETE" }),
};