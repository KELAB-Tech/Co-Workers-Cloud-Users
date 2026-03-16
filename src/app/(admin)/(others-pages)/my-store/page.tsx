"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import {
  Store, Package, ShoppingCart, Warehouse,
  MapPin, Phone, CheckCircle, Clock,
  XCircle, Pencil, ExternalLink, Loader2,
} from "lucide-react";
import { getMyStore, type Store as StoreType } from "@/services/storeService";
import { getMyStoreProducts } from "@/services/productService";

export default function MyStore() {
  const [store,   setStore]   = useState<StoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(true);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [storeData, products] = await Promise.all([
          getMyStore(),
          getMyStoreProducts().catch(() => []),
        ]);
        setStore(storeData);
        setProductCount(products.length);
      } catch {
        setHasStore(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── STATUS CONFIG ──────────────────────────────────
  const statusConfig = {
    APPROVED: {
      label: "Aprobada",
      classes: "bg-green-50 text-green-700 border-green-200",
      icon: <CheckCircle className="h-3.5 w-3.5" />,
    },
    PENDING: {
      label: "En revisión",
      classes: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    SUSPENDED: {
      label: "Suspendida",
      classes: "bg-red-50 text-red-700 border-red-200",
      icon: <XCircle className="h-3.5 w-3.5" />,
    },
  };

  // ── LOADING ───────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Cargando tu tienda...</p>
        </div>
      </div>
    );
  }

  // ── NO STORE ──────────────────────────────────────
  if (!hasStore) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="relative max-w-lg w-full text-center">

          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-[#45C93E]/5 blur-3xl" />
          </div>

          <div className="relative flex items-center justify-center mb-10">
            <div
              className="absolute h-56 w-56 rounded-full border border-dashed border-gray-200"
              style={{ animation: "spin 18s linear infinite" }}
            />
            <div className="absolute h-44 w-44 rounded-full border border-gray-100" />

            <Link
              href="/my-store/create"
              className="group relative flex flex-col items-center justify-center h-32 w-32 rounded-full
                         bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl hover:shadow-2xl
                         hover:scale-105 transition-all duration-300 border border-gray-300/60"
            >
              <div className="absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm" />
              <Store size={28} className="relative z-10 text-gray-400 group-hover:text-[#45C93E] transition-colors mb-1" />
              <span className="relative z-10 text-[10px] font-bold tracking-widest uppercase text-gray-400 group-hover:text-[#45C93E] transition-colors">
                Crear
              </span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 tracking-tight dark:text-white">
            Tu tienda te espera
          </h2>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Configura tu espacio de ventas en minutos y empieza a conectar con compradores desde el primer día.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Productos ilimitados", "Gestión de pedidos", "Analíticas en tiempo real"].map((feat) => (
              <span key={feat} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                {feat}
              </span>
            ))}
          </div>

          <Link
            href="/my-store/create"
            className="inline-block mt-8 text-sm text-[#45C93E] font-medium hover:underline underline-offset-4"
          >
            Comenzar ahora →
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[store?.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const activeProducts = productCount;

  // ── STORE PAGE ────────────────────────────────────
  return (
    <div>
      <PageBreadcrumb pageTitle="Mi tienda" />

      <div className="space-y-6">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#000180] via-[#000180] to-[#45C93E] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, #45C93E 0%, transparent 50%),
                                   radial-gradient(circle at 80% 20%, white 0%, transparent 40%)`
              }}
            />
          </div>

          <div className="px-6 pb-6 mt-14">
            <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12 mb-5">

              {/* Logo */}
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-white border-4 border-white dark:border-gray-900 shadow-lg flex-shrink-0">
                {store?.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <Store className="text-[#45C93E]" size={32} />
                  </div>
                )}
              </div>

              {/* Info + actions */}
              <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{store?.name}</h2>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.classes}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {store?.description && (
                    <p className="text-sm text-gray-500 max-w-xl line-clamp-2">{store.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-2">
                    {store?.city && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3.5 w-3.5" /> {store.city}
                        {store.address && ` · ${store.address}`}
                      </span>
                    )}
                    {store?.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone className="h-3.5 w-3.5" /> {store.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href="/my-store/settings"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2
                               text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors
                               dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  {store?.status === "APPROVED" && (
                    <Link
                      href={`/marketplace/tienda/${store.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#45C93E] px-4 py-2
                                 text-sm font-medium text-white hover:opacity-90 transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Ver en marketplace
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Alerta si está pendiente */}
            {store?.status === "PENDING" && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                  Tu tienda está <strong>en revisión</strong>. El equipo de Kelab la aprobará pronto.
                  Mientras tanto puedes crear productos, pero no serán visibles en el marketplace.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Productos",    value: activeProducts,                    icon: Package,      href: "/products",   color: "text-blue-600" },
            { label: "Pedidos",      value: "Próximamente",                    icon: ShoppingCart, href: "/orders",     color: "text-[#45C93E]" },
            { label: "Inventario",   value: "Ver stock",                       icon: Warehouse,    href: "/inventory",  color: "text-purple-600" },
            { label: "Marketplace",  value: store?.status === "APPROVED" ? "Activa" : "Pendiente", icon: ExternalLink, href: `/marketplace/tienda/${store?.id}`, color: "text-[#000180]" },
          ].map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="group rounded-2xl border border-gray-100 bg-white p-5
                         hover:border-[#45C93E]/30 hover:shadow-md transition-all
                         dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <s.icon className={`mb-3 h-5 w-5 ${s.color}`} />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 dark:text-gray-400">
            Acciones rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/products/create"
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4
                         hover:border-[#45C93E]/30 hover:shadow-md transition-all group
                         dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="rounded-xl bg-[#45C93E]/10 p-2.5 group-hover:bg-[#45C93E]/20 transition-colors">
                <Package className="h-5 w-5 text-[#45C93E]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-white">Crear producto</p>
                <p className="text-xs text-gray-400">Publica nuevos materiales</p>
              </div>
            </Link>

            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4
                         hover:border-purple-200 hover:shadow-md transition-all group
                         dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="rounded-xl bg-purple-50 p-2.5 group-hover:bg-purple-100 transition-colors">
                <Warehouse className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-white">Ver inventario</p>
                <p className="text-xs text-gray-400">Controla tu stock</p>
              </div>
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4
                         hover:border-blue-200 hover:shadow-md transition-all group
                         dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="rounded-xl bg-blue-50 p-2.5 group-hover:bg-blue-100 transition-colors">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-white">Mis productos</p>
                <p className="text-xs text-gray-400">Gestiona tu catálogo</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}