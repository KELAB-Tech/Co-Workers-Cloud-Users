"use client";

import React, { useRef, useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Camera } from "lucide-react";
import {
  UserProfile, UserSelfUpdateRequest,
  updateMyProfile, getInitials,
} from "@/services/Userservice";

// ── Avatar local storage ──────────────────────────────────────
const AVATAR_KEY = "kelab_user_avatar";
const saveLocalAvatar = (dataUrl: string) => {
  try { localStorage.setItem(AVATAR_KEY, dataUrl); } catch { /* noop */ }
};
const getLocalAvatar = (): string | null => {
  try { return localStorage.getItem(AVATAR_KEY); } catch { return null; }
};

// ── Labels ────────────────────────────────────────────────────
const actorLabel: Record<string, string> = {
  RECICLADOR:      "Reciclador / Gestor",
  TRANSFORMADOR:   "Transformador / Productor",
  TRANSPORTADOR:   "Transportador",
  ADMIN_SECTORIAL: "Admin Sectorial",
  ADMIN_GENERAL:   "Admin General",
};

// ── Avatar con upload ────────────────────────────────────────
function AvatarUpload({
  initials, avatarUrl, onChange,
}: {
  initials: string;
  avatarUrl: string | null;
  onChange: (dataUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Solo imágenes JPG, PNG o WEBP"); return; }
    if (file.size > 3 * 1024 * 1024)    { alert("Máximo 3 MB"); return; }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      saveLocalAvatar(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="relative group w-20 h-20 flex-shrink-0">

      {/* Círculo */}
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white
                      dark:border-gray-800 bg-[#45C93E]/10 flex items-center
                      justify-center shadow-md">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#45C93E] text-2xl font-bold select-none">
            {initials}
          </span>
        )}
      </div>

      {/* Overlay hover */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="absolute inset-0 rounded-full flex flex-col items-center justify-center
                   bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Cambiar foto de perfil"
      >
        <Camera className="h-5 w-5 text-white" />
        <span className="text-white text-[9px] mt-0.5 font-medium">Cambiar</span>
      </button>

      {/* Badge verde si tiene foto */}
      {avatarUrl && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#45C93E]
                        border-2 border-white dark:border-gray-900
                        flex items-center justify-center shadow-sm">
          <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
interface Props {
  profile: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}

export default function UserMetaCard({ profile, onUpdate }: Props) {
  const { isOpen, openModal, closeModal } = useModal();

  const [avatar,  setAvatar]  = useState<string | null>(null);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar avatar local al montar
  useEffect(() => {
    setAvatar(getLocalAvatar());
  }, []);

  const handleOpen = () => {
    setName(profile.name);
    setEmail(profile.email);
    setError(null);
    setSuccess(false);
    openModal();
  };

  const handleSave = async () => {
    if (!name.trim())  { setError("El nombre es obligatorio."); return; }
    if (!email.trim()) { setError("El email es obligatorio."); return; }

    setSaving(true);
    setError(null);
    try {
      const updated = await updateMyProfile({
        name:  name.trim(),
        email: email.trim().toLowerCase(),
      });
      onUpdate(updated);
      setSuccess(true);
      setTimeout(() => closeModal(), 1200);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">

            {/* AVATAR CON UPLOAD */}
            <div className="flex flex-col items-center gap-1">
              <AvatarUpload
                initials={getInitials(profile.name)}
                avatarUrl={avatar}
                onChange={setAvatar}
              />
              <span className="text-[10px] text-gray-400">
                {avatar ? "Foto guardada" : "Hover para cambiar"}
              </span>
            </div>

            {/* INFO */}
            <div>
              <h4 className="mb-1 text-lg font-semibold text-center text-gray-800
                             dark:text-white/90 xl:text-left">
                {profile.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center
                              xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {actorLabel[profile.actorType] ?? profile.actorType}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.email}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  profile.enabled
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  {profile.enabled ? "Activo" : "Suspendido"}
                </span>
              </div>
            </div>
          </div>

          {/* BOTÓN EDITAR */}
          <button
            onClick={handleOpen}
            className="flex w-full items-center justify-center gap-2 rounded-full border
                       border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700
                       shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800
                       dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
                fill="" />
            </svg>
            Editar
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">

          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Editar Perfil
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Actualiza tu nombre y correo electrónico.
            </p>
          </div>

          {success && (
            <div className="mb-4 px-4 py-3 text-sm text-green-700 bg-green-50
                            border border-green-200 rounded-lg dark:bg-green-900/20
                            dark:border-green-700 dark:text-green-400">
              ✅ Perfil actualizado correctamente.
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50
                            border border-red-200 rounded-lg dark:bg-red-900/20
                            dark:border-red-700 dark:text-red-400">
              ❌ {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label>Nombre <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <Label>Correo electrónico <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Info solo lectura */}
          <div className="mt-5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border
                          border-gray-100 dark:border-white/[0.05] p-4 space-y-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Solo el administrador puede cambiar
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tipo de Actor</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {actorLabel[profile.actorType] ?? profile.actorType}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tipo de Persona</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {profile.tipoPersona === "NATURAL" ? "Persona Natural" : "Persona Jurídica"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Roles</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {profile.roles.map((r) => r.replace("ROLE_", "")).join(", ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || success}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}