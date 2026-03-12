"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ComponentCard from "@/components/common/ComponentCard";
import FileInput from "@/components/form/input/FileInput";
import Label from "@/components/form/Label";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreateProduct() {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <div>

      <PageBreadcrumb pageTitle="Crear Producto" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft size={18} />
          Volver a productos
        </Link>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Nuevo producto
        </h2>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Información del producto */}
        <ComponentCard title="Información del Producto">

          <div className="space-y-6">

            <Input
              label="Nombre del producto"
              name="name"
              placeholder="Ej: Tarjeta empresarial"
            />

            <TextArea
              label="Descripción"
              name="description"
              placeholder="Describe el producto"
            />

            <div className="grid gap-6 md:grid-cols-2">

              <Input
                label="Precio"
                name="price"
                type="number"
                placeholder="20.00"
              />

              <Input
                label="Stock"
                name="stock"
                type="number"
                placeholder="Cantidad disponible"
              />

            </div>

          </div>

        </ComponentCard>

        {/* Imagen */}
        <ComponentCard title="Imagen del Producto">

          <div className="space-y-4">

            <Label>Subir imagen</Label>

            <FileInput
              onChange={handleFileChange}
              className="custom-class"
            />

            <p className="text-sm text-gray-500">
              Formatos permitidos: JPG, PNG.
            </p>

          </div>

        </ComponentCard>

      </div>

      {/* Botones */}
      <div className="mt-6 flex justify-end gap-4">

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm hover:bg-gray-100"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Crear producto
        </button>

      </div>

    </div>
  );
}