"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useMemo } from "react";
import { InventorySummaryResponse } from "@/services/inventoryService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: InventorySummaryResponse | null;
  loading: boolean;
};

export default function MonthlySalesChart({ data, loading }: Props) {

  const [isOpen, setIsOpen] = useState(false);

  // Agrupa los movimientos recientes por día para la gráfica
  const { entradas, salidas, categories } = useMemo(() => {
    const movements = data?.recentMovements ?? [];

    // Obtener días únicos ordenados
    const daysMap = new Map<string, { entradas: number; salidas: number }>();

    movements.forEach((m) => {
      const day = m.createdAt.slice(0, 10); // "2026-03-12"
      if (!daysMap.has(day)) daysMap.set(day, { entradas: 0, salidas: 0 });
      const cur = daysMap.get(day)!;
      if (m.type === "ENTRADA") cur.entradas += m.quantity;
      if (m.type === "SALIDA")  cur.salidas  += m.quantity;
    });

    const sorted = [...daysMap.entries()].sort(([a], [b]) => a.localeCompare(b));

    return {
      categories: sorted.map(([day]) => day.slice(5)),  // "03-12"
      entradas:   sorted.map(([, v]) => v.entradas),
      salidas:    sorted.map(([, v]) => v.salidas),
    };
  }, [data]);

  const options: ApexOptions = {
    colors: ["#45C93E", "#ef4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 260,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 3, colors: ["transparent"] },
    xaxis: {
      categories: categories.length > 0 ? categories : ["—"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => String(Math.round(val)),
        style: { colors: "#6B7280" },
      },
    },
    grid: { borderColor: "#E5E7EB", yaxis: { lines: { show: true } } },
    legend: { show: true, position: "top", horizontalAlign: "left", fontFamily: "Outfit" },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: true },
      y: { formatter: (val) => `${val} uds` },
    },
  };

  const series = [
    { name: "Entradas", data: entradas.length > 0 ? entradas : [0] },
    { name: "Salidas",  data: salidas.length  > 0 ? salidas  : [0] },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Movimientos recientes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entradas y salidas por día
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Ver detalles
            </DropdownItem>
            <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Exportar datos
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* CHART */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
            <div className="h-[260px] flex items-end gap-3 px-6 pb-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gray-100 dark:bg-gray-800 animate-pulse"
                  style={{ height: `${40 + Math.random() * 120}px` }}
                />
              ))}
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="bar" height={260} />
          )}
        </div>
      </div>

    </div>
  );
}