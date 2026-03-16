import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductsTable from "@/components/tables/products/ProductsTable";
import Link from "next/link";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Gestiona tus productos | Co-Workers Cloud",
  description:
    "Administra los productos de tu tienda en Co-Workers Cloud",
};

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

        {/* TABLE */}
        <ProductsTable />

      </div>

    </div>
  );
}