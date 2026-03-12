"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import Link from "next/link";
import { getMyStoreProducts, Product } from "@/services/productService";
import { Package, AlertCircle } from "lucide-react";

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyStoreProducts();
        setProducts(data);
      } catch {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── LOADING ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
              <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
              <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
        <AlertCircle size={16} />
        {error}
      </div>
    );
  }

  // ── EMPTY ─────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <Package size={36} className="text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-500">
          Aún no tienes productos
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Crea tu primer producto para verlo aquí
        </p>
      </div>
    );
  }

  // ── TABLE ─────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">

          <Table>

            {/* HEADER */}

            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>

                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500">
                  Producto
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500">
                  Precio
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500">
                  Stock
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500">
                  Estado
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500">
                  Creado
                </TableCell>

                <TableCell isHeader className="px-5 py-3 text-end text-theme-xs text-gray-500">
                  Acciones
                </TableCell>

              </TableRow>
            </TableHeader>

            {/* BODY */}

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

              {products.map((product) => (

                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >

                  {/* PRODUCT */}

                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {product.mainImageUrl ? (
                          <Image
                            width={40}
                            height={40}
                            src={product.mainImageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package size={16} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-theme-xs line-clamp-1 max-w-[200px]">
                          {product.description}
                        </p>
                      </div>

                    </div>
                  </TableCell>

                  {/* PRICE */}

                  <TableCell className="px-4 py-3 font-medium text-gray-800 text-theme-sm dark:text-white">
                    ${Number(product.price).toLocaleString("es-CO")}
                  </TableCell>

                  {/* STOCK */}

                  <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                    {product.stock}
                  </TableCell>

                  {/* STATUS — basado en stock igual que el original */}

                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={
                        product.stock > 10
                          ? "success"
                          : product.stock > 0
                          ? "warning"
                          : "error"
                      }
                    >
                      {product.stock > 10
                        ? "Disponible"
                        : product.stock > 0
                        ? "Stock Bajo"
                        : "Sin Stock"}
                    </Badge>
                  </TableCell>

                  {/* CREATED AT */}

                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                    {new Date(product.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell className="px-4 py-3 text-end space-x-3">
                    <Link
                      href={`/products/edit/${product.id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Editar
                    </Link>
                    <button className="text-red-600 text-sm hover:underline">
                      Eliminar
                    </button>
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>
      </div>

      {/* FOOTER */}

      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 text-sm dark:border-white/[0.05]">
        <p className="text-gray-500">
          Mostrando{" "}
          <span className="font-medium text-gray-700">{products.length}</span>{" "}
          producto{products.length !== 1 ? "s" : ""}
        </p>
      </div>

    </div>
  );
}