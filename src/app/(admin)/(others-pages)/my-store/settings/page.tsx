"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState, useRef } from "react";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Store, Upload, X,
  Loader2, CheckCircle, AlertCircle, Camera,
} from "lucide-react";
import {
  getMyStore, updateStore, uploadStoreLogo,
  type Store as StoreType,
} from "@/services/storeService";

export default function StoreSettings() {
  const router      = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── STATE ──────────────────────────────────────────
  const [storeId,   setStoreId]   = useState<number | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  const [form, setForm] = useState({
    name:        "",
    description: "",
    address:     "",
    city:        "",
    phone:       "",
  });

  const [logoPreview,     setLogoPreview]     = useState<string | null>(null);
  const [uploadingLogo,   setUploadingLogo]   = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);

  // ── LOAD EXISTING DATA ─────────────────────────────
  useEffect(() => {
    getMyStore()
      .then((store: StoreType) => {
        setStoreId(store.id);
        setForm({
          name:        store.name        ?? "",
          description: store.description ?? "",
          address:     store.address     ?? "",
          city:        store.city        ?? "",
          phone:       store.phone       ?? "",
        });
        // ✅ Pre-cargar logo existente
        if (store.logoUrl) {
          setLogoPreview(store.logoUrl);
          setUploadedLogoUrl(store.logoUrl);
        }
      })
      .catch(() => setError("No se pudo cargar la tienda"))
      .finally(() => setLoading(false));
  }, []);

  // ── HANDLERS ──────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB");
      return;
    }

    setError(null);

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploadingLogo(true);
    try {
      const url = await uploadStoreLogo(file);
      setUploadedLogoUrl(url);
    } catch {
      setError("Error subiendo el logo. Intenta de nuevo.");
      // Revertir al logo anterior
      setLogoPreview(uploadedLogoUrl);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setUploadedLogoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim())    return setError("El nombre es obligatorio");
    if (!form.city.trim())    return setError("La ciudad es obligatoria");
    if (!form.address.trim()) return setError("La dirección es obligatoria");
    if (!storeId)             return setError("No se encontró tu tienda");

    setSaving(true);
    try {
      await updateStore(storeId, {
        name:        form.name.trim(),
        description: form.description.trim(),
        address:     form.address.trim(),
        city:        form.city.trim(),
        phone:       form.phone.trim(),
        logoUrl:     uploadedLogoUrl ?? "",
      });
      setSuccess(true);
      setTimeout(() => router.push("/my-store"), 1500);
    } catch (err: any) {
      setError(err.message || "Error actualizando la tienda");
    } finally {
      setSaving(false);
    }
  };

  // ── LOADING ───────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────
  return (
    <div>
      <PageBreadcrumb pageTitle="Configuración de tienda" />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/my-store"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft size={18} />
          Volver a mi tienda
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Editar tienda
        </h2>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          ¡Tienda actualizada! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-2">

          {/* ── INFO ── */}
          <ComponentCard title="Información de la tienda">
            <div className="space-y-5">

              <Input
                label="Nombre de la tienda"
                name="name"
                placeholder="EcoTransforma Marketplace"
                value={form.name}
                onChange={handleChange}
              />

              <TextArea
                label="Descripción"
                name="description"
                placeholder="Describe tu tienda, qué materiales manejas..."
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />

              <Input
                label="Dirección"
                name="address"
                placeholder="Zona Industrial Km 3"
                value={form.address}
                onChange={handleChange}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Ciudad"
                  name="city"
                  placeholder="Bogotá"
                  value={form.city}
                  onChange={handleChange}
                />
                <Input
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  placeholder="3100000000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

            </div>
          </ComponentCard>

          {/* ── LOGO ── */}
          <ComponentCard title="Logo de la tienda">
            <div className="space-y-5">

              {/* Vista previa del logo actual o uploader */}
              <div className="flex flex-col items-center gap-4">

                {logoPreview ? (
                  <div className="relative">
                    {/* Logo */}
                    <div className="relative h-32 w-32">
                      <img
                        src={logoPreview}
                        alt="Logo de la tienda"
                        className="h-32 w-32 rounded-2xl object-cover border-2 border-gray-200 dark:border-gray-700 shadow-md"
                      />

                      {/* Overlay de carga */}
                      {uploadingLogo && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-black/50">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                          <p className="text-xs font-medium text-white">Subiendo...</p>
                        </div>
                      )}

                      {/* Badge listo */}
                      {uploadedLogoUrl && !uploadingLogo && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 shadow-md">
                          <CheckCircle className="h-3 w-3 text-white" />
                          <span className="text-[10px] font-bold text-white whitespace-nowrap">Logo listo</span>
                        </div>
                      )}

                      {/* Botón cambiar — superpuesto */}
                      {!uploadingLogo && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -right-2 -top-2 rounded-full bg-[#45C93E] p-2 text-white shadow-md hover:opacity-90 transition-all"
                          title="Cambiar logo"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Botón eliminar */}
                      {!uploadingLogo && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -left-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600 transition-colors"
                          title="Eliminar logo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <p className="mt-6 text-xs text-gray-400 text-center">
                      Haz clic en el ícono verde para cambiar el logo
                    </p>
                  </div>
                ) : (
                  /* Uploader vacío */
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl
                               border-2 border-dashed border-gray-300 py-10 transition-all
                               hover:border-[#45C93E] hover:bg-[#45C93E]/5
                               dark:border-gray-700 dark:hover:border-[#45C93E]"
                  >
                    <div className="rounded-full bg-gray-100 p-5 dark:bg-gray-800">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Subir logo de la tienda
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        JPG, PNG o WEBP · Máx 5MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-[#45C93E] px-4 py-2 text-sm font-medium text-white">
                      <Upload className="h-4 w-4" />
                      Seleccionar logo
                    </div>
                  </button>
                )}

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="text-xs text-gray-400 text-center">
                El logo se sube automáticamente al seleccionarlo y se guardará al hacer clic en "Guardar cambios".
              </p>

            </div>
          </ComponentCard>

        </div>

        {/* ── BOTONES ── */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/my-store"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium
                       text-gray-600 hover:bg-gray-100 transition-colors
                       dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingLogo || success}
            className="inline-flex items-center gap-2 rounded-lg bg-[#45C93E] px-6 py-2.5
                       text-sm font-medium text-white hover:opacity-90 transition-all
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
            ) : uploadingLogo ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo logo...</>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}