"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "1", sales: 120 },
  { day: "2", sales: 210 },
  { day: "3", sales: 180 },
  { day: "4", sales: 260 },
  { day: "5", sales: 300 },
  { day: "6", sales: 280 },
  { day: "7", sales: 340 },
  { day: "8", sales: 390 },
  { day: "9", sales: 420 },
  { day: "10", sales: 380 },
  { day: "11", sales: 450 },
  { day: "12", sales: 470 },
  { day: "13", sales: 510 },
  { day: "14", sales: 530 },
  { day: "15", sales: 490 },
];

export default function SalesChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Ventas últimos 30 días
          </h3>

          <p className="text-sm text-gray-500">
            Ingresos generados por tu tienda
          </p>
        </div>

        <span className="text-sm text-green-600 font-medium">
          +12.5%
        </span>

      </div>

      {/* CHART */}

      <div className="h-[320px] w-full">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />

            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
              }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#45C93E"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}