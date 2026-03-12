"use client";

import { useEffect, useState, useCallback } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { getDashboardData, DashboardData } from "@/services/Dashboardservice";
import { RefreshCw } from "lucide-react";

export default function Ecommerce() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDashboardData();
      setData(result);
    } catch {
      // falla silenciosamente — cada componente muestra su propio estado vacío
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="flex flex-col space-y-6">

      {/* REFRESH */}
      <div className="flex justify-end">
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {/* METRICS */}
      <EcommerceMetrics data={data?.inventory ?? null} loading={loading} />

      {/* CHART + TARGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <MonthlySalesChart data={data?.inventory ?? null} loading={loading} />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <MonthlyTarget data={data?.inventory ?? null} loading={loading} />
        </div>
      </div>

      {/* RECENT MOVEMENTS */}
      <RecentOrders data={data?.inventory ?? null} loading={loading} />

    </div>
  );
}