import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductsTable from "@/components/tables/products/ProductsTable";
import Link from "next/link";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";

export default function ProductsPage() {
  return (
    <div>

      <PageBreadcrumb pageTitle="Productos" />

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Gestiona tus productos
            </h1>

            <p className="text-sm text-gray-500">
              Administra los productos de tu tienda
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button className="flex items-center dark:bg-gray-100 gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <RefreshCw size={16} />
              Refrescar
            </button>

            <Link
              href="/products/create"
              className="flex items-center gap-2 rounded-lg bg-[#45C93E] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Plus size={18} />
              Crear producto
            </Link>

          </div>

        </div>

        {/* SEARCH + FILTROS */}

        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:flex-row md:items-center md:justify-between">

          {/* SEARCH */}

          <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">

            <Search className="text-gray-400" size={18} />

            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-64 bg-transparent outline-none dark:text-gray-100 text-sm"
            />

          </div>

          {/* FILTROS */}

          <div className="flex items-center gap-3">

            {/* Estado */}

            <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:text-gray-100 dark:border-gray-700 dark:bg-transparent">
              <option>Todos</option>
              <option>Activo</option>
              <option>Sin stock</option>
            </select>

            {/* Cantidad */}

            <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:text-gray-100 dark:border-gray-700 dark:bg-transparent">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>

            <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
              <Filter size={16} />
              Filtros
            </button>

          </div>

        </div>

        {/* INFO */}

        <div className="flex items-center justify-between text-sm text-gray-500">

          <p>
            Mostrando <span className="font-medium text-gray-700">1–10</span> de{" "}
            <span className="font-medium text-gray-700">48</span> productos
          </p>

        </div>

        {/* TABLE */}

        <ProductsTable />

        

      </div>

    </div>
  );
}