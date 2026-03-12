import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import InventoryTable from "@/components/tables/InventoryTable";

export const metadata: Metadata = {
  title: "Inventario | Co-Workers cloud",
  description:
    "Gestiona el inventario de tu tienda con facilidad en Co-Workers cloud.",
};

export default function InventoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Inventario" />

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Inventario de Productos
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Controla el stock de todos tus productos
            </p>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            + Ajustar Inventario
          </button>

        </div>

        {/* TABLE */}

        <InventoryTable />

      </div>
    </div>
  );
}