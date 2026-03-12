"use client";

import { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryTable from "@/components/tables/InventoryTable";
import {
  getInventorySummary,
  InventorySummaryResponse,
} from "@/services/Inventoryservice";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function InventoryPage() {
  const [summary, setSummary] = useState<InventorySummaryResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [tableKey, setTableKey] = useState(0); // fuerza re-render de la tabla

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const data = await getInventorySummary();
      setSummary(data);
    } catch {
      // summary falla silenciosamente — la tabla tiene su propio error
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const handleRefresh = () => {
    loadSummary();
    setTableKey((k) => k + 1); // re-monta InventoryTable para que recargue
  };

  const cards = [
    {
      label: "Total productos",
      value: summary?.totalProducts ?? "—",
      color: "text-gray-800 dark:text-white",
      icon: <Package size={16} className="text-gray-400" />,
    },
    {
      label: "Disponible",
      value: summary?.activeProducts ?? "—",
      color: "text-green-600 dark:text-green-400",
      icon: <CheckCircle size={16} className="text-green-400" />,
    },
    {
      label: "Stock bajo",
      value: summary?.lowStockAlerts ?? "—",
      color: "text-yellow-600 dark:text-yellow-400",
      icon: <AlertTriangle size={16} className="text-yellow-400" />,
    },
    {
      label: "Sin stock",
      value: summary?.outOfStockProducts ?? "—",
      color: "text-red-500 dark:text-red-400",
      icon: <XCircle size={16} className="text-red-400" />,
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Inventario" />

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white px-6 py-8 dark:border-gray-800 dark:bg-white/[0.03]">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Inventario
            </h2>
            <p className="text-sm text-gray-500">
              Controla el stock de todos tus productos
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw size={15} />
            Actualizar
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-gray-800"
            >
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <h3 className={`text-2xl font-semibold mt-0.5 ${card.color}`}>
                  {loadingSummary ? (
                    <span className="inline-block h-7 w-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ALERTAS */}
        {summary && summary.alerts.length > 0 && (
          <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/10 p-4 space-y-1.5">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
              <AlertTriangle size={15} />
              {summary.criticalAlerts > 0
                ? `${summary.criticalAlerts} producto${summary.criticalAlerts > 1 ? "s" : ""} sin stock — acción urgente`
                : `${summary.lowStockAlerts} producto${summary.lowStockAlerts > 1 ? "s" : ""} con stock bajo`}
            </p>
            {summary.alerts.slice(0, 3).map((alert) => (
              <p key={alert.productId} className="text-sm text-yellow-700 dark:text-yellow-500 ml-5">
                {alert.productName} —{" "}
                {alert.level === "CRITICAL"
                  ? "sin stock"
                  : `${alert.currentStock} unidad${alert.currentStock !== 1 ? "es" : ""} (mín. ${alert.minStock})`}
              </p>
            ))}
            {summary.alerts.length > 3 && (
              <p className="text-xs text-yellow-600 dark:text-yellow-500 ml-5">
                +{summary.alerts.length - 3} más con alertas
              </p>
            )}
          </div>
        )}

        {/* TABLA */}
        <InventoryTable key={tableKey} />

      </div>
    </div>
  );
}