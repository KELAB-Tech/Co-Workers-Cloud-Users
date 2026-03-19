"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import {
  getCurrentStock, StockItemResponse,
  getMovementsByProduct, MovementResponse,
} from "@/services/inventoryService";
import AdjustStockModal from "@/components/inventory/AdjustStockModal";
import {
  Package, AlertCircle, X,
  ArrowDownCircle, ArrowUpCircle, RefreshCw,
} from "lucide-react";

// ── MOVEMENTS DRAWER ──────────────────────────────────────────
function MovementsDrawer({
  productId, productName, onClose,
}: {
  productId: number;
  productName: string;
  onClose: () => void;
}) {
  const [movements, setMovements] = useState<MovementResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovementsByProduct(productId)
      .then(setMovements)
      .finally(() => setLoading(false));
  }, [productId]);

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const typeColor = (t: string) =>
    t === "ENTRADA" ? "text-green-600 dark:text-green-400"
    : t === "SALIDA" ? "text-red-500 dark:text-red-400"
    : "text-blue-500 dark:text-blue-400";

  return (
    // Overlay — fixed, cubre TODO incluyendo navbar (inset-0, z-[9999])
    <div
      className="fixed inset-0 z-[999999] flex justify-end"
      style={{ isolation: "isolate" }}
    >
      {/* Fondo opaco — click cierra */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div
        className="relative w-full max-w-sm bg-white dark:bg-gray-900
                   border-l border-gray-200 dark:border-gray-800
                   h-full overflow-y-auto flex flex-col shadow-2xl
                   animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              Historial de movimientos
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
              {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800 overflow-y-auto">
          {loading ? (
            <div className="p-5 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-40 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : movements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-3">
                <Package size={28} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">Sin movimientos</p>
              <p className="text-xs text-gray-400 mt-1">
                Aún no hay movimientos para este producto
              </p>
            </div>
          ) : (
            movements.map((m) => (
              <div key={m.id} className="px-5 py-3.5 flex items-start gap-3
                                         hover:bg-gray-50 dark:hover:bg-white/[0.02]
                                         transition-colors">
                {/* Ícono tipo */}
                <div className="mt-0.5 flex-shrink-0">
                  {m.type === "ENTRADA" ? (
                    <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-1.5">
                      <ArrowDownCircle size={16} className="text-green-500" />
                    </div>
                  ) : m.type === "SALIDA" ? (
                    <div className="rounded-full bg-red-50 dark:bg-red-900/20 p-1.5">
                      <ArrowUpCircle size={16} className="text-red-400" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-1.5">
                      <RefreshCw size={16} className="text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-xs font-bold ${typeColor(m.type)}`}>
                      {m.type}
                    </span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0">
                      {new Date(m.createdAt).toLocaleDateString("es-CO", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Stock antes → después */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {m.stockBefore}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {m.stockAfter}
                    </span>
                    <span className={`ml-1 font-semibold ${
                      m.type === "ENTRADA" ? "text-green-600" :
                      m.type === "SALIDA"  ? "text-red-500"   : "text-blue-500"
                    }`}>
                      ({m.type === "ENTRADA" ? "+" : m.type === "SALIDA" ? "-" : "="}{m.quantity})
                    </span>
                  </div>

                  {m.reason && (
                    <p className="text-[11px] text-gray-400 mt-1 truncate">
                      💬 {m.reason}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {movements.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            <p className="text-xs text-gray-400 text-center">
              {movements.length} movimiento{movements.length !== 1 ? "s" : ""} registrado{movements.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── INVENTORY TABLE ───────────────────────────────────────────
export default function InventoryTable() {
  const [items, setItems]       = useState<StockItemResponse[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [adjustModal,     setAdjustModal]     = useState<StockItemResponse | null>(null);
  const [movementsDrawer, setMovementsDrawer] = useState<StockItemResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentStock();
      setItems(data);
    } catch {
      setError("No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalPages   = Math.ceil(items.length / itemsPerPage);
  const startIndex   = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
  const startItem    = startIndex + 1;
  const endItem      = Math.min(startIndex + itemsPerPage, items.length);

  const getBadge = (item: StockItemResponse) => {
    if (item.currentStock === 0)                    return { label: "Sin stock",   color: "error"   as const };
    if (item.currentStock <= item.minStock)          return { label: "Stock bajo",  color: "warning" as const };
    return                                                  { label: "Disponible", color: "success" as const };
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 animate-pulse last:border-0">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-36 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="h-3 w-10 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-6 w-20 rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
        <AlertCircle size={16} /> {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] py-16">
        <Package size={36} className="text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-500">Sin productos en inventario</p>
        <p className="text-xs text-gray-400 mt-1">Crea productos en tu tienda para verlos aquí</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Producto", "Stock actual", "Stock mínimo", "Estado"].map(h => (
                    <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      {h}
                    </TableCell>
                  ))}
                  <TableCell isHeader className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((item) => {
                  const badge = getBadge(item);
                  return (
                    <TableRow key={item.productId} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">

                      {/* Producto */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            {item.mainImageUrl ? (
                              <img src={item.mainImageUrl} alt={item.productName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-lg">
                                {item.categoryIcon ?? <Package size={16} className="text-gray-300" />}
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white/90 text-theme-sm">
                            {item.productName}
                          </span>
                        </div>
                      </TableCell>

                      {/* Stock actual */}
                      <TableCell className="px-4 py-3">
                        <span className={`font-semibold text-theme-sm ${
                          item.currentStock === 0         ? "text-red-500" :
                          item.currentStock <= item.minStock ? "text-yellow-600" :
                          "text-gray-700 dark:text-gray-300"
                        }`}>
                          {item.currentStock}
                        </span>
                      </TableCell>

                      {/* Stock mínimo */}
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                        {item.minStock}
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="px-4 py-3">
                        <Badge size="sm" color={badge.color}>{badge.label}</Badge>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="px-4 py-3 text-end space-x-3">
                        <button
                          onClick={() => setAdjustModal(item)}
                          className="text-blue-600 text-sm hover:underline font-medium"
                        >
                          Ajustar
                        </button>
                        <button
                          onClick={() => setMovementsDrawer(item)}
                          className="text-gray-500 text-sm hover:underline font-medium hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Movimientos
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
          <div className="text-sm text-gray-500">
            Mostrando {startItem}–{endItem} de {items.length} productos
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 text-sm border border-gray-200 dark:text-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded-lg ${
                  currentPage === i + 1
                    ? "bg-[#45C93E] text-white"
                    : "border border-gray-200 dark:text-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 text-sm border border-gray-200 dark:text-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Siguiente
            </button>
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-1 text-sm border border-gray-200 dark:text-gray-100 dark:border-gray-700 rounded-lg dark:bg-transparent"
          >
            <option value={5}>5 / pág</option>
            <option value={10}>10 / pág</option>
            <option value={25}>25 / pág</option>
            <option value={50}>50 / pág</option>
          </select>
        </div>
      </div>

      {/* MODAL AJUSTAR */}
      {adjustModal && (
        <AdjustStockModal
          productId={adjustModal.productId}
          productName={adjustModal.productName}
          currentStock={adjustModal.currentStock}
          onClose={() => setAdjustModal(null)}
          onSuccess={load}
        />
      )}

      {/* DRAWER MOVIMIENTOS */}
      {movementsDrawer && (
        <MovementsDrawer
          productId={movementsDrawer.productId}
          productName={movementsDrawer.productName}
          onClose={() => setMovementsDrawer(null)}
        />
      )}
    </>
  );
}