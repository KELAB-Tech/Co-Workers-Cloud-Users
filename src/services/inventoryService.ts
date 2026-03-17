import Cookies from "js-cookie";
import { api } from "@/utils/api";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type MovementType = "ENTRADA" | "SALIDA" | "AJUSTE";

export type MovementResponse = {
  id: number;
  productId: number;
  productName: string;
  type: MovementType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  reason: string | null;
  createdBy: string;
  createdAt: string;
};

export type StockAlertResponse = {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  level: "CRITICAL" | "LOW";
};

export type StockItemResponse = {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  status: "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";
  mainImageUrl: string | null;  // ← NUEVO
  categoryIcon: string | null;  // ← NUEVO
};

export type InventorySummaryResponse = {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  inactiveProducts: number;
  totalEntradas: number;
  totalSalidas: number;
  criticalAlerts: number;
  lowStockAlerts: number;
  recentMovements: MovementResponse[];
  alerts: StockAlertResponse[];
};

export type MovementRequest = {
  productId: number;
  type: MovementType;
  quantity: number;
  reason?: string;
};

// ─────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────

// GET /api/inventory/summary
export const getInventorySummary = (): Promise<InventorySummaryResponse> =>
  api.get("/inventory/summary");

// GET /api/inventory/stock
export const getCurrentStock = (): Promise<StockItemResponse[]> =>
  api.get("/inventory/stock");

// GET /api/inventory/alerts
export const getInventoryAlerts = (): Promise<StockAlertResponse[]> =>
  api.get("/inventory/alerts");

// GET /api/inventory/movements
export const getMovements = (): Promise<MovementResponse[]> =>
  api.get("/inventory/movements");

// GET /api/inventory/movements?type=ENTRADA
export const getMovementsByType = (type: MovementType): Promise<MovementResponse[]> =>
  api.get(`/inventory/movements?type=${type}`);

// GET /api/inventory/movements/product/{id}
export const getMovementsByProduct = (productId: number): Promise<MovementResponse[]> =>
  api.get(`/inventory/movements/product/${productId}`);

// POST /api/inventory/movement
export const registerMovement = (data: MovementRequest): Promise<MovementResponse> =>
  api.post("/inventory/movement", data);

// PUT /api/inventory/product/{id}/min-stock
export const setMinStock = (productId: number, minStock: number): Promise<null> =>
  api.put(`/inventory/product/${productId}/min-stock`, { minStock });