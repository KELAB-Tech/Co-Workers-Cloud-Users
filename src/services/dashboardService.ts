import { api } from "@/utils/api";
import { InventorySummaryResponse } from "@/services/inventoryService";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type DashboardData = {
  inventory: InventorySummaryResponse;
  // Aquí puedes agregar orders, revenue, etc. cuando tengas esos endpoints
};

// ─────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────

// Trae todo lo necesario para el dashboard en paralelo
export const getDashboardData = async (): Promise<DashboardData> => {
  const [inventory] = await Promise.all([
    api.get("/inventory/summary") as Promise<InventorySummaryResponse>,
  ]);

  return { inventory };
};