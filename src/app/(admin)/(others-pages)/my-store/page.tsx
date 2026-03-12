"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Link from "next/link";
import { Store, Package, ShoppingCart, Warehouse, Users } from "lucide-react";
import SalesChart from "@/components/charts/SalesChart";
import { getMyStore } from "@/services/storeService";

type StoreType = {
  id: number;
  name: string;
  description: string;
  phone: string;
  city: string;
  address: string;
  logoUrl: string;
  status: string;
  active: boolean;
};

export default function MyStore() {

  const [store, setStore] = useState<StoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(true);

  useEffect(() => {
    const loadStore = async () => {
      try {
        const data = await getMyStore();
        setStore(data);
      } catch (error) {
        setHasStore(false);
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, []);

  if (loading) {
    return <p className="p-6">Cargando tienda...</p>;
  }

  if (!hasStore) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="relative max-w-lg w-full text-center">

          {/* Fondo decorativo blur */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-[#45C93E]/5 blur-3xl" />
          </div>

          {/* Anillos + botón circular */}
          <div className="relative flex items-center justify-center mb-10">
            {/* Anillo exterior punteado */}
            <div
              className="absolute h-56 w-56 rounded-full border border-dashed border-gray-200"
              style={{ animation: "spin 18s linear infinite" }}
            />
            {/* Anillo medio */}
            <div className="absolute h-44 w-44 rounded-full border border-gray-100" />

            {/* Botón circular gris – el CTA principal */}
            <Link
              href="/my-store/create"
              className="group relative flex flex-col items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-300/60"
            >
              {/* Capa glassmorphism */}
              <div className="absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm" />

              <Store
                size={28}
                className="relative z-10 text-gray-400 group-hover:text-[#45C93E] transition-colors duration-300 mb-1"
              />
              <span className="relative z-10 text-[10px] font-bold tracking-widest uppercase text-gray-400 group-hover:text-[#45C93E] transition-colors duration-300">
                Crear
              </span>
            </Link>
          </div>

          {/* Encabezado */}
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Tu tienda te espera
          </h2>

          <p className="mt-3 text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Configura tu espacio de ventas en minutos y empieza a conectar con tus clientes desde el primer día.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Productos ilimitados", "Gestión de pedidos", "Analíticas en tiempo real"].map((feat) => (
              <span
                key={feat}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200"
              >
                {feat}
              </span>
            ))}
          </div>

          {/* CTA texto secundario */}
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

  return (
    <div>

      <PageBreadcrumb pageTitle="Mi tienda" />

      <div className="space-y-8">

        {/* STORE HERO */}

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">

          <div className="h-32 bg-gradient-to-r from-[#45C93E] to-green-600" />

          <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">

            {/* LOGO */}

            <div className="h-20 w-20 rounded-xl bg-white shadow flex items-center justify-center -mt-12 border">

              {store?.logoUrl ? (
                <img
                  src={store.logoUrl}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <Store className="text-[#45C93E]" size={32} />
              )}

            </div>

            {/* INFO */}

            <div className="flex-1">

              <h2 className="text-2xl font-semibold text-gray-800">
                {store?.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {store?.description}
              </p>

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>{store?.city}</span>
                <span>{store?.phone}</span>
                <span>{store?.status}</span>
              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3">

              <Link
                href="/my-store/settings"
                className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
              >
                Editar tienda
              </Link>

              <Link
                href={`/store/${store?.id}`}
                className="px-4 py-2 rounded-lg bg-[#45C93E] text-white text-sm hover:opacity-90"
              >
                Ver tienda
              </Link>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <Link
            href="/products/create"
            className="rounded-xl border p-5 hover:shadow-lg transition"
          >
            <Package className="mb-3 text-[#45C93E]" />
            <p className="font-semibold dark:text-gray-100">Crear producto</p>
            <p className="text-xs text-gray-500">Publica nuevos productos</p>
          </Link>

          <Link
            href="/orders"
            className="rounded-xl border p-5 hover:shadow-lg transition"
          >
            <ShoppingCart className="mb-3 text-[#45C93E]" />
            <p className="font-semibold dark:text-gray-100">Ver pedidos</p>
            <p className="text-xs text-gray-500">Gestiona tus ventas</p>
          </Link>

          <Link
            href="/inventory"
            className="rounded-xl border p-5 hover:shadow-lg transition"
          >
            <Warehouse className="mb-3 text-[#45C93E]" />
            <p className="font-semibold dark:text-gray-100">Inventario</p>
            <p className="text-xs text-gray-500">Controla tu stock</p>
          </Link>

          <Link
            href="/analytics"
            className="rounded-xl border p-5 hover:shadow-lg transition"
          >
            <Users className="mb-3 text-[#45C93E]" />
            <p className="font-semibold dark:text-gray-100">Clientes</p>
            <p className="text-xs text-gray-500">Revisa tu audiencia</p>
          </Link>

        </div>

      </div>

    </div>
  );
}