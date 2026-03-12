import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

export const getMyStore = async () => {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/store/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error obteniendo tienda");
  }

  return data;
};

export const createStore = async (storeData: any) => {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storeData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error creando tienda");
  }

  return data;
};