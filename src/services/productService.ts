import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/api";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Category = {
  id: number;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  productCount: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  featured: boolean;
  mainImageUrl: string | null;
  imageUrls: string[];
  categoryId: number | null;
  categoryName: string | null;
  categoryIcon: string | null;
  storeId: number;
  storeName: string;
  storeCity: string;
  storeLogoUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
  mainImageUrl: string;
  categoryId?: number | null;
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const getToken = () => Cookies.get("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─────────────────────────────────────────────
// CATEGORÍAS — público, no necesita token
// ─────────────────────────────────────────────

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Error cargando categorías");
  return res.json();
};

// ─────────────────────────────────────────────
// UPLOAD — sube imagen a Cloudinary via backend
// ─────────────────────────────────────────────

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload/product`, {
    method: "POST",
    headers: {
      // ⚠️ NO poner Content-Type aquí — el browser lo setea automático con boundary
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error subiendo imagen");
  }

  const data = await res.json();
  return data.url; // URL de Cloudinary
};

// ─────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────

/** Mis productos (owner) */
export const getMyStoreProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products/my-store`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error cargando productos");
  return res.json();
};

/** Crear producto — necesita storeId del owner */
export const createProduct = async (
  storeId: number,
  data: CreateProductRequest
): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/store/${storeId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error creando producto");
  }

  return res.json();
};

/** Actualizar producto */
export const updateProduct = async (
  productId: number,
  data: CreateProductRequest
): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error actualizando producto");
  }

  return res.json();
};

/** Eliminar producto */
export const deleteProduct = async (productId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error eliminando producto");
};

/** Mi tienda — para obtener el storeId del owner */
export const getMyStore = async () => {
  const res = await fetch(`${API_URL}/store/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No tienes tienda registrada");
  return res.json();
};

// ── FORMATTER ──────────────────────────────────────
export const formatPrice = (price: number): string => {
  if (price == null) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};