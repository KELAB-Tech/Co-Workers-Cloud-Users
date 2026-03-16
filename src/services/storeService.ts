import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

export type StoreStatus = "PENDING" | "APPROVED" | "SUSPENDED";

export type Store = {
  id: number;
  name: string;
  description: string;
  phone: string;
  city: string;
  address: string;
  logoUrl: string | null;
  status: StoreStatus;
  active: boolean;
};

export type StoreRequest = {
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  logoUrl: string;
};

const getToken = () => Cookies.get("token") ?? "";
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const uploadStoreLogo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload/store`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error subiendo logo");
  }

  const data = await res.json();
  return data.url;
};

export const getMyStore = async (): Promise<Store> => {
  const res = await fetch(`${API_URL}/store/me`, {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error obteniendo tienda");
  return data;
};

export const createStore = async (data: StoreRequest): Promise<Store> => {
  const res = await fetch(`${API_URL}/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Error creando tienda");
  return result;
};

export const updateStore = async (storeId: number, data: StoreRequest): Promise<Store> => {
  const res = await fetch(`${API_URL}/store/${storeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Error actualizando tienda");
  return result;
};