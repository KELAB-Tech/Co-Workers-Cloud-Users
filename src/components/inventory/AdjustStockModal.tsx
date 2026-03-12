"use client";

import { useState } from "react";
import { registerMovement, MovementType } from "@/services/Inventoryservice";
import { X } from "lucide-react";

type Props = {
  productId: number;
  productName: string;
  currentStock: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AdjustStockModal({
  productId,
  productName,
  currentStock,
  onClose,
  onSuccess,
}: Props) {
  const [type, setType] = useState<MovementType>("ENTRADA");
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview =
    type === "ENTRADA"
      ? currentStock + quantity
      : type === "SALIDA"
      ? currentStock - quantity
      : quantity;

  const handleSubmit = async () => {
    setError(null);
    if (quantity < 1) {
      setError("La cantidad debe ser al menos 1");
      return;
    }
    setLoading(true);
    try {
      await registerMovement({ productId, type, quantity, reason: reason || undefined });
      onSuccess();
      onClose();
    } catch {
      setError("No se pudo registrar el movimiento. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">
              Ajustar inventario
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-4">

          {/* Tipo */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Tipo de movimiento
            </label>
            <div className="flex gap-2">
              {(["ENTRADA", "SALIDA", "AJUSTE"] as MovementType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    type === t
                      ? t === "ENTRADA"
                        ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                        : t === "SALIDA"
                        ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
                        : "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400"
                      : "border-gray-200 text-gray-500 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {type === "AJUSTE"
                ? "AJUSTE fija el stock al valor exacto que ingreses."
                : type === "SALIDA"
                ? "SALIDA descuenta del stock actual."
                : "ENTRADA suma al stock actual."}
            </p>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {type === "AJUSTE" ? "Nuevo stock" : "Cantidad"}
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:text-white"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm">
            <span className="text-gray-500">Stock resultante</span>
            <span
              className={`font-semibold text-base ${
                preview < 0
                  ? "text-red-500"
                  : preview === 0
                  ? "text-yellow-500"
                  : "text-gray-800 dark:text-white"
              }`}
            >
              {preview < 0 ? "⚠ Insuficiente" : preview}
            </span>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Motivo <span className="text-gray-300">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Reposición semanal, Venta pedido #88..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-400 dark:text-white"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || preview < 0}
            className="flex-1 py-2 rounded-lg bg-[#45C93E] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Confirmar"}
          </button>
        </div>

      </div>
    </div>
  );
}