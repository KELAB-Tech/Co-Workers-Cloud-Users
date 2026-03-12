"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {

  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };

  }, []);

  const options: ApexOptions = {

    colors: ["#45C93E", "#000180"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0,
      },
    },

    markers: {
      size: 0,
      hover: { size: 6 },
    },

    grid: {
      yaxis: {
        lines: { show: true },
      },
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      y: {
        formatter: (val: number, { seriesIndex }) => {
          if (seriesIndex === 1) return `$${val}`;
          return `${val} pedidos`;
        },
      },
    },

    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],

      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },

    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  };

  const series = [
    {
      name: "Pedidos",
      data: [120, 150, 170, 160, 190, 210, 230, 250, 260, 280, 300, 320],
    },
    {
      name: "Ingresos",
      data: [3200, 4100, 4500, 4300, 5200, 6100, 6800, 7200, 8000, 8700, 9100, 9800],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Actividad de la plataforma
          </h3>

          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Pedidos e ingresos durante el año
          </p>
        </div>

        <div className="flex items-center gap-3">

          <ChartTab />

          <div className="relative inline-flex items-center">

            <CalenderIcon className="absolute left-3 text-gray-500 dark:text-gray-400" />

            <input
              ref={datePickerRef}
              className="h-10 w-40 pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              placeholder="Seleccionar rango"
            />

          </div>

        </div>

      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>

    </div>
  );
}