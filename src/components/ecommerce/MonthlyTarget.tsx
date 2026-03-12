"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { InventorySummaryResponse } from "@/services/InventoryService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: InventorySummaryResponse | null;
  loading: boolean;
};

export default function MonthlyTarget({ data, loading }: Props) {

  const totalEntradas = data?.totalEntradas ?? 0;
  const totalSalidas  = data?.totalSalidas ?? 0;
  const totalMovements = totalEntradas + totalSalidas;

  // Meta dinámica: 20% más que el total de movimientos (o 100 mínimo)
  const meta = Math.max(100, Math.ceil(totalMovements * 1.2));
  const progress = meta > 0 ? Math.min((totalMovements / meta) * 100, 100) : 0;

  const series = [progress];

  const options: ApexOptions = {
    colors: ["#45C93E"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "75%" },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -10,
            color: "#1D2939",
            formatter: () => progress.toFixed(1) + "%",
          },
        },
      },
    },
    fill: { type: "solid" },
    stroke: { lineCap: "round" },
    labels: ["Progreso"],
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">

      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">

        {/* HEADER */}
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Actividad del inventario
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Movimientos del período
            </p>
          </div>

          <div className="relative inline-block">
            <button onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
              <DropdownItem onItemClick={() => setIsOpen(false)}>Ver reporte</DropdownItem>
              <DropdownItem onItemClick={() => setIsOpen(false)}>Exportar</DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* CHART */}
        <div className="relative">
          {loading ? (
            <div className="h-[330px] flex items-center justify-center">
              <div className="h-48 w-48 rounded-full border-4 border-gray-100 dark:border-gray-800 animate-pulse" />
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          )}
        </div>

        <p className="mx-auto mt-6 max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {loading ? (
            <span className="inline-block h-4 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : (
            <>
              <b>{totalMovements}</b> movimientos registrados.{" "}
              {progress >= 100 ? "¡Meta alcanzada! 🎉" : `Meta: ${meta} movimientos.`}
            </>
          )}
        </p>

      </div>

      {/* STATS */}
      <div className="flex items-center justify-center gap-8 px-6 py-5">

        <div>
          <p className="text-center text-gray-500 text-sm">Meta</p>
          <p className="text-center text-lg font-semibold text-gray-800 dark:text-white">
            {loading ? "—" : meta}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />

        <div>
          <p className="text-center text-gray-500 text-sm">Entradas</p>
          <p className="text-center text-lg font-semibold text-green-600 dark:text-green-400">
            {loading ? "—" : totalEntradas}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />

        <div>
          <p className="text-center text-gray-500 text-sm">Salidas</p>
          <p className="text-center text-lg font-semibold text-red-500 dark:text-red-400">
            {loading ? "—" : totalSalidas}
          </p>
        </div>

      </div>
    </div>
  );
}