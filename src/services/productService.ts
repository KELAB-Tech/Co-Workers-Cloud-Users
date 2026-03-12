import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  mainImageUrl: string | null;
  imageUrls: string[];
  storeId: number;
  createdAt: string;
  updatedAt: string | null;
};

export const getMyStoreProducts = async (): Promise<Product[]> => {
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/products/my-store`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error cargando productos");
  }

  return res.json();
};