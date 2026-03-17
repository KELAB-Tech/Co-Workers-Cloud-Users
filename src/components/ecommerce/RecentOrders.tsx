"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { InventorySummaryResponse, MovementResponse } from "@/services/inventoryService";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Package } from "lucide-react";

type Props = {
  data: InventorySummaryResponse | null;
  loading: boolean;
};

function MovementTypeBadge({ type }: { type: MovementResponse["type"] }) {
  if (type === "ENTRADA") return <Badge size="sm" color="success">ENTRADA</Badge>;
  if (type === "SALIDA")  return <Badge size="sm" color="error">SALIDA</Badge>;
  return <Badge size="sm" color="info">AJUSTE</Badge>;
}

function MovementIcon({ type }: { type: MovementResponse["type"] }) {
  if (type === "ENTRADA") return <ArrowDownCircle size={16} className="text-green-500" />;
  if (type === "SALIDA")  return <ArrowUpCircle size={16} className="text-red-400" />;
  return <RefreshCw size={14} className="text-blue-400" />;
}

export default function RecentOrders({ data, loading }: Props) {

  const movements = data?.recentMovements ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Movimientos recientes
        </h3>
        <button className="text-sm text-[#45C93E] font-medium hover:underline">
          Ver todos
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
              <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && movements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Package size={28} className="mb-2 text-gray-300" />
          <p className="text-sm">Sin movimientos registrados</p>
        </div>
      )}

      {/* TABLE */}
      {!loading && movements.length > 0 && (
        <div className="max-w-full overflow-x-auto">
          <Table>

            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 text-start">
                  Producto
                </TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 text-start">
                  Tipo
                </TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 text-start">
                  Cantidad
                </TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 text-start">
                  Stock
                </TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 text-start">
                  Motivo
                </TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 text-start">
                  Fecha
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {movements.map((m) => (
                <TableRow key={m.id}>

                  {/* Producto */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <MovementIcon type={m.type} />
                      <p className="font-medium text-gray-800 text-sm dark:text-white">
                        {m.productName}
                      </p>
                    </div>
                  </TableCell>

                  {/* Tipo */}
                  <TableCell className="py-3">
                    <MovementTypeBadge type={m.type} />
                  </TableCell>

                  {/* Cantidad */}
                  <TableCell className="py-3 text-gray-500 text-sm font-medium">
                    {m.type === "SALIDA" ? `-${m.quantity}` : `+${m.quantity}`}
                  </TableCell>

                  {/* Stock antes → después */}
                  <TableCell className="py-3 text-gray-500 text-sm">
                    {m.stockBefore} → <span className="font-medium text-gray-700 dark:text-gray-300">{m.stockAfter}</span>
                  </TableCell>

                  {/* Motivo */}
                  <TableCell className="py-3 text-gray-500 text-sm max-w-[160px]">
                    <span className="truncate block">{m.reason ?? "—"}</span>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="py-3 text-gray-400 text-sm">
                    {new Date(m.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      )}

    </div>
  );
}