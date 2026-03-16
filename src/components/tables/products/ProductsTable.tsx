"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Pencil, Trash2, Loader2, AlertTriangle,
  Package, CheckCircle, XCircle, AlertCircle,
  Search, ChevronLeft, ChevronRight,
} from "lucide-react";
import Cookies from "js-cookie";
import { deleteProduct, formatPrice, type Product } from "@/services/productService";

const API_URL = "http://localhost:8080/api";

interface PagedProducts {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const STATUS_OPTIONS = [
  { value: "",              label: "Todos los estados" },
  { value: "ACTIVE",        label: "Activo" },
  { value: "OUT_OF_STOCK",  label: "Sin stock" },
  { value: "INACTIVE",      label: "Inactivo" },
];

const PAGE_SIZES = [10, 25, 50];

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
    ACTIVE: {
      label:   "Activo",
      classes: "bg-green-50 text-green-700 border-green-200",
      icon:    <CheckCircle className="h-3 w-3" />,
    },
    OUT_OF_STOCK: {
      label:   "Sin stock",
      classes: "bg-orange-50 text-orange-700 border-orange-200",
      icon:    <AlertCircle className="h-3 w-3" />,
    },
    INACTIVE: {
      label:   "Inactivo",
      classes: "bg-gray-100 text-gray-500 border-gray-200",
      icon:    <XCircle className="h-3 w-3" />,
    },
  };
  const s = map[status] ?? map.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${s.classes}`}>
      {s.icon} {s.label}
    </span>
  );
};

export default function ProductsTable() {
  const [products,      setProducts]      = useState<Product[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  // Paginación
  const [page,          setPage]          = useState(0);
  const [pageSize,      setPageSize]      = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);

  // Filtros
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Delete modal
  const [deleteTarget,  setDeleteTarget]  = useState<Product | null>(null);
  const [deleting,      setDeleting]      = useState(false);
  const [deleteError,   setDeleteError]   = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── DEBOUNCE SEARCH ────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // reset al buscar
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Reset page cuando cambia el filtro de estado
  useEffect(() => { setPage(0); }, [statusFilter]);

  // ── FETCH ─────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");

      const params = new URLSearchParams();
      params.set("page",    String(page));
      params.set("size",    String(pageSize));
      params.set("sortBy",  "createdAt");
      params.set("sortDir", "desc");
      if (debouncedSearch) params.set("name", debouncedSearch);
      if (statusFilter)    params.set("status", `[${statusFilter}]`);

      const res = await fetch(`${API_URL}/products/my-store?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error cargando productos");

      const data: PagedProducts | Product[] = await res.json();

      // Backend puede devolver Page<> o List<>
      if (Array.isArray(data)) {
        // Sin paginación del backend — paginamos localmente
        let filtered = data as Product[];
        if (debouncedSearch)
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        if (statusFilter)
          filtered = filtered.filter((p) => p.status === statusFilter);

        const start = page * pageSize;
        const slice = filtered.slice(start, start + pageSize);

        setProducts(slice);
        setTotalElements(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize));
      } else {
        setProducts(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      }
    } catch (e: any) {
      setError(e.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── DELETE ────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === deleteTarget.id ? { ...p, status: "INACTIVE" } : p
        )
      );
      setDeleteTarget(null);
    } catch (e: any) {
      setDeleteError(e.message || "Error eliminando el producto");
    } finally {
      setDeleting(false);
    }
  };

  // ── PAGINACIÓN HELPERS ────────────────────────────
  const startItem  = totalElements === 0 ? 0 : page * pageSize + 1;
  const endItem    = Math.min((page + 1) * pageSize, totalElements);
  const canPrev    = page > 0;
  const canNext    = page < totalPages - 1;

  // Genera rango de páginas a mostrar (máx 5)
  const pageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i);
    if (page <= 2)       return [0, 1, 2, 3, 4];
    if (page >= totalPages - 3) return Array.from({ length: 5 }, (_, i) => totalPages - 5 + i);
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  // ── RENDER ─────────────────────────────────────────
  return (
    <>
      {/* ── FILTROS ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between
                      rounded-xl border border-gray-200 bg-white p-4
                      dark:border-gray-800 dark:bg-white/[0.03]">

        {/* Buscador */}
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2
                        dark:border-gray-700 focus-within:border-[#45C93E] transition-colors w-full md:w-72">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none text-gray-700 dark:text-gray-300
                       placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Controles derechos */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Filtro estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm
                       dark:border-gray-700 dark:bg-transparent dark:text-gray-300
                       outline-none focus:border-[#45C93E] transition-colors"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Tamaño de página */}
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm
                       dark:border-gray-700 dark:bg-transparent dark:text-gray-300
                       outline-none focus:border-[#45C93E] transition-colors"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>Mostrar {s}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Info resultados */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-1">
          <p>
            {totalElements === 0
              ? "Sin resultados"
              : <>Mostrando <span className="font-medium text-gray-700 dark:text-gray-300">{startItem}–{endItem}</span> de <span className="font-medium text-gray-700 dark:text-gray-300">{totalElements}</span> productos</>
            }
          </p>
          {(debouncedSearch || statusFilter) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); setPage(0); }}
              className="text-xs text-[#45C93E] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── TABLA ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border
                        border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="h-7 w-7 animate-spin" />
            <p className="text-sm">Cargando productos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl
                        border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl
                        border border-dashed border-gray-300 bg-white
                        dark:border-gray-700 dark:bg-white/[0.03]">
          <div className="rounded-full bg-gray-100 p-5 dark:bg-gray-800">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              {debouncedSearch || statusFilter ? "Sin resultados" : "Sin productos"}
            </p>
            <p className="text-sm text-gray-400">
              {debouncedSearch || statusFilter
                ? "Intenta con otros filtros"
                : "Aún no tienes productos en tu tienda"}
            </p>
          </div>
          {!debouncedSearch && !statusFilter && (
            <Link href="/products/create"
              className="rounded-lg bg-[#45C93E] px-5 py-2 text-sm font-medium text-white hover:opacity-90">
              Crear primer producto
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white
                        dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
                  {["Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider
                                           text-gray-500 ${h === "Acciones" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((p) => (
                  <tr key={p.id}
                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]
                                ${p.status === "INACTIVE" ? "opacity-50" : ""}`}>

                    {/* Producto */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border
                                        border-gray-200 bg-gray-100 dark:border-gray-700">
                          {p.mainImageUrl ? (
                            <img src={p.mainImageUrl} alt={p.name}
                              className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">
                              {p.categoryIcon || "📦"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900 dark:text-white max-w-[180px]">
                            {p.name}
                          </p>
                          <p className="truncate text-xs text-gray-400 max-w-[180px]">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-4">
                      {p.categoryName ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50
                                         px-2.5 py-1 text-xs font-medium text-blue-700
                                         dark:bg-blue-900/20 dark:text-blue-400">
                          {p.categoryIcon} {p.categoryName}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* Precio */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(p.price)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4">
                      <span className={`font-medium ${
                        p.stock === 0  ? "text-red-500" :
                        p.stock <= 5   ? "text-orange-500" :
                        "text-gray-700 dark:text-gray-300"
                      }`}>
                        {p.stock} uds.
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/edit/${p.id}`}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5
                                     text-xs font-medium text-gray-600 hover:border-blue-300
                                     hover:bg-blue-50 hover:text-blue-700 transition-all
                                     dark:border-gray-700 dark:text-gray-400">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Link>

                        {p.status !== "INACTIVE" && (
                          <button onClick={() => setDeleteTarget(p)}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5
                                       text-xs font-medium text-gray-600 hover:border-red-300
                                       hover:bg-red-50 hover:text-red-700 transition-all
                                       dark:border-gray-700 dark:text-gray-400">
                            <Trash2 className="h-3.5 w-3.5" /> Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PAGINACIÓN ─────────────────────────────────── */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">

          <p className="text-sm text-gray-500 order-2 sm:order-1">
            Página <span className="font-medium text-gray-700 dark:text-gray-300">{page + 1}</span> de{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1 order-1 sm:order-2">

            {/* Anterior */}
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!canPrev}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2
                         text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed
                         dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.05]"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>

            {/* Números */}
            {pageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors
                  ${page === p
                    ? "bg-[#45C93E] text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  }`}
              >
                {p + 1}
              </button>
            ))}

            {/* Siguiente */}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2
                         text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed
                         dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.05]"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>

          </div>
        </div>
      )}

      {/* ── MODAL DELETE ──────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl
                          dark:bg-gray-900 dark:border dark:border-gray-800">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full
                            bg-red-100 dark:bg-red-900/30 mx-auto">
              <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-center text-lg font-bold text-gray-900 dark:text-white mb-2">
              ¿Eliminar producto?
            </h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              Estás a punto de desactivar:
            </p>
            <p className="text-center font-semibold text-gray-800 dark:text-white mb-2">
              "{deleteTarget.name}"
            </p>
            <p className="text-center text-xs text-gray-400 mb-6">
              El producto quedará como{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">Inactivo</span>{" "}
              y dejará de aparecer en el marketplace.
            </p>

            {deleteError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200
                              bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                disabled={deleting}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-medium
                           text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50
                           dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl
                           bg-red-600 py-2.5 text-sm font-medium text-white
                           hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Eliminando...</>
                  : <><Trash2 className="h-4 w-4" /> Sí, eliminar</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}