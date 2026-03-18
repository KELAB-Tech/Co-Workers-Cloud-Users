"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState, useRef } from "react";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft, Upload, X, ImageIcon,
  Loader2, CheckCircle, AlertCircle,
} from "lucide-react";
import {
  getCategories, getMyStore, updateProduct,
  uploadProductImage, type Category, type Product,
} from "@/services/productService";
import Cookies from "js-cookie";

const API_URL = "https://backend-co-workers-cloud.onrender.com/api";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── STATE ──────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeId, setStoreId]       = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);

  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", categoryId: "",
  });

  const [imagePreview,     setImagePreview]     = useState<string | null>(null);
  const [uploadingImage,   setUploadingImage]   = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);

  // ── LOAD ───────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, store] = await Promise.all([
          getCategories(),
          getMyStore(),
        ]);
        setCategories(cats);
        setStoreId(store.id);

        // Cargar producto actual
        const token = Cookies.get("token");
        const res = await fetch(`${API_URL}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Producto no encontrado");
        const p: Product = await res.json();

        setForm({
          name:        p.name,
          description: p.description,
          price:       String(p.price),
          stock:       String(p.stock),
          categoryId:  p.categoryId ? String(p.categoryId) : "",
        });
        setUploadedImageUrl(p.mainImageUrl);
        setImagePreview(p.mainImageUrl);
      } catch (e: any) {
        setError(e.message || "Error cargando el producto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  // ── HANDLERS ──────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setUploadedImageUrl(url);
    } catch {
      setError("Error subiendo la imagen. Intenta de nuevo.");
      setImagePreview(uploadedImageUrl); // vuelve a la anterior
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim())        return setError("El nombre es obligatorio");
    if (!form.description.trim()) return setError("La descripción es obligatoria");
    if (!form.price || Number(form.price) <= 0) return setError("El precio debe ser mayor a 0");
    if (form.stock === "" || Number(form.stock) < 0) return setError("El stock no puede ser negativo");
    if (!uploadedImageUrl)        return setError("El producto debe tener una imagen");

    setSubmitting(true);
    try {
      await updateProduct(productId, {
        name:         form.name.trim(),
        description:  form.description.trim(),
        price:        Number(form.price),
        stock:        Number(form.stock),
        mainImageUrl: uploadedImageUrl,
        categoryId:   form.categoryId ? Number(form.categoryId) : null,
      });
      setSuccess(true);
      setTimeout(() => router.push("/products"), 1500);
    } catch (err: any) {
      setError(err.message || "Error actualizando el producto");
    } finally {
      setSubmitting(false);
    }
  };

  // ── LOADING STATE ──────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────
  return (
    <div>
      <PageBreadcrumb pageTitle="Editar Producto" />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft size={18} />
          Volver a productos
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Editar producto
        </h2>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ¡Producto actualizado! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-2">

          {/* ── INFO ── */}
          <ComponentCard title="Información del Producto">
            <div className="space-y-5">

              <Input
                label="Nombre del producto"
                name="name"
                placeholder="Ej: Cartón Corrugado por Tonelada"
                value={form.name}
                onChange={handleChange}
              />

              <TextArea
                label="Descripción"
                name="description"
                placeholder="Describe el material..."
                value={form.description}
                onChange={handleChange}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Precio (COP)"
                  name="price"
                  type="number"
                  placeholder="280000"
                  value={form.price}
                  onChange={handleChange}
                />
                <Input
                  label="Stock disponible"
                  name="stock"
                  type="number"
                  placeholder="50"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>

              {/* CATEGORÍA */}
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">Categoría de material</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm
                             text-gray-700 outline-none transition-all
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                             dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  <option value="">— Sin categoría —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </ComponentCard>

          {/* ── IMAGEN ── */}
          <ComponentCard title="Imagen del Producto">
            <div className="space-y-4">

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-56 w-full rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="text-sm font-medium text-white">Subiendo a Cloudinary...</p>
                    </div>
                  )}
                  {uploadedImageUrl && !uploadingImage && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1">
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                      <span className="text-xs font-semibold text-white">Imagen lista</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-56 w-full flex-col items-center justify-center gap-3 rounded-xl
                             border-2 border-dashed border-gray-300 bg-gray-50 transition-all
                             hover:border-blue-400 hover:bg-blue-50/50
                             dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Haz clic para subir nueva imagen
                  </p>
                  <div className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                    <Upload className="h-4 w-4" />
                    Seleccionar imagen
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* botón cambiar imagen si ya hay una */}
              {imagePreview && !uploadingImage && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300
                             py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors
                             dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <Upload className="h-4 w-4" />
                  Cambiar imagen
                </button>
              )}

            </div>
          </ComponentCard>

        </div>

        {/* BOTONES */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/products"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium
                       text-gray-600 hover:bg-gray-100 transition-colors
                       dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5
                       text-sm font-medium text-white transition-all hover:bg-blue-700
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
            ) : uploadingImage ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo imagen...</>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}