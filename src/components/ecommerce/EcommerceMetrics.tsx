"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine } from "@/icons";
import { PackageIcon, ShoppingCartIcon, TrendingUp, AlertTriangle } from "lucide-react";
import { InventorySummaryResponse } from "@/services/inventoryService";

type Props = {
  data: InventorySummaryResponse | null;
  loading: boolean;
};

export const EcommerceMetrics = ({ data, loading }: Props) => {

  const totalMovements = (data?.totalEntradas ?? 0) + (data?.totalSalidas ?? 0);

  const metrics = [
    {
      title: "Total productos",
      value: loading ? null : String(data?.totalProducts ?? "—"),
      badge: null,
      icon: <PackageIcon size={20} />,
    },
    {
      title: "Productos activos",
      value: loading ? null : String(data?.activeProducts ?? "—"),
      badge: data
        ? { color: "success" as const, icon: <ArrowUpIcon />, label: `${data.activeProducts} activos` }
        : null,
      icon: <TrendingUp size={20} />,
    },
    {
      title: "Movimientos totales",
      value: loading ? null : String(totalMovements),
      badge: data
        ? { color: "info" as const, icon: <ArrowUpIcon />, label: `${data.totalEntradas} entradas` }
        : null,
      icon: <ShoppingCartIcon size={20} />,
    },
    {
      title: "Alertas de stock",
      value: loading ? null : String((data?.criticalAlerts ?? 0) + (data?.lowStockAlerts ?? 0)),
      badge: data && (data.criticalAlerts + data.lowStockAlerts) > 0
        ? { color: "error" as const, icon: <ArrowDownIcon />, label: `${data.criticalAlerts} críticas` }
        : data
        ? { color: "success" as const, icon: <ArrowUpIcon />, label: "Sin alertas" }
        : null,
      icon: <BoxIconLine />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          {/* ICON */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <div className="text-gray-800 dark:text-white/90">
              {metric.icon}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>

              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value === null ? (
                  <span className="inline-block h-7 w-12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : (
                  metric.value
                )}
              </h4>
            </div>

            {metric.badge && (
              <Badge color={metric.badge.color}>
                {metric.badge.icon}
                {metric.badge.label}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};