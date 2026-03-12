"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ComponentCard from "@/components/common/ComponentCard";
import FileInput from "@/components/form/input/FileInput";
import Label from "@/components/form/Label";
import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { createStore } from "@/services/storeService";
import { useRouter } from "next/navigation";

export default function CreateStore() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    logoUrl: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string) => (value: string) => {
    setForm({
        ...form,
        [name]: value,
    });
    };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);

    // por ahora solo simulamos la URL
    setForm({
      ...form,
      logoUrl: preview,
    });

  };

  const handleSubmit = async () => {

    try {

      setLoading(true);

      await createStore(form);

      alert("Tienda creada correctamente");

      router.push("/my-store");

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  };

  return (
    <div>

      <PageBreadcrumb pageTitle="Crear tienda" />

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <Link
          href="/my-store"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={18} />
          Volver a mi tienda
        </Link>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Crear nueva tienda
        </h2>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Información */}

        <ComponentCard title="Información de la tienda">
        <div className="space-y-6">

            <div>
            <Label>Nombre de la tienda</Label>
            <Input
                name="name"
                placeholder="EcoTransforma Marketplace"
                value={form.name}
                onChange={handleChange}
            />
            </div>

            <div>
            <Label>Descripción</Label>
            <TextArea
            placeholder="Describe tu tienda"
            value={form.description}
            onChange={handleChange("description")}
            />

            </div>

            <div>
            <Label>Dirección</Label>
            <Input
                name="address"
                placeholder="Zona Industrial Km 3"
                value={form.address}
                onChange={handleChange}
            />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
            <div>
                <Label>Ciudad</Label>
                <Input
                name="city"
                placeholder="Pereira"
                value={form.city}
                onChange={handleChange}
                />
            </div>

            <div>
                <Label>Teléfono</Label>
                <Input
                name="phone"
                type="phone"
                placeholder="3100000000"
                value={form.phone}
                onChange={handleChange}
                />
            </div>
            </div>

        </div>
        </ComponentCard>


        {/* Logo */}

        <ComponentCard title="Logo de la tienda">

          <div className="space-y-4">

            <Label>Subir logo</Label>

            <FileInput
              onChange={handleFileChange}
            />

            <p className="text-sm text-gray-500">
              Formatos permitidos: JPG, PNG.
            </p>

            {logoPreview && (

              <div className="mt-4 flex justify-center">

                <img
                  src={logoPreview}
                  className="h-24 w-24 rounded-xl object-cover border"
                />

              </div>

            )}

            {!logoPreview && (

              <div className="mt-4 flex justify-center">

                <div className="h-24 w-24 flex items-center justify-center rounded-xl border bg-gray-50">
                  <Store className="text-gray-400" />
                </div>

              </div>

            )}

          </div>

        </ComponentCard>

      </div>

      {/* Botones */}

      <div className="mt-6 flex justify-end gap-4">

        <Link
          href="/my-store"
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm hover:bg-gray-100"
        >
          Cancelar
        </Link>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-[#45C93E] px-6 py-2 text-white hover:opacity-90"
        >
          {loading ? "Creando..." : "Crear tienda"}
        </button>

      </div>

    </div>
  );
}