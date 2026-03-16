import Cookies from "js-cookie";
import { api } from "@/utils/api";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type TipoPersona = "NATURAL" | "JURIDICA";

export type ActorType =
  | "RECICLADOR"
  | "TRANSFORMADOR"
  | "TRANSPORTADOR"
  | "ADMIN_SECTORIAL"
  | "ADMIN_GENERAL";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  tipoPersona: TipoPersona;
  actorType: ActorType;
  roles: string[];
  afiliado: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

// ✅ Exactamente lo que acepta el backend
export interface UserSelfUpdateRequest {
  name: string;
  email: string;
  phone?: string; // opcional
}

// ─────────────────────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────────────────────

export const getMyProfile = (): Promise<UserProfile> =>
  api.get("/users/me");

export const updateMyProfile = (
  data: UserSelfUpdateRequest
): Promise<UserProfile> => api.put("/users/me", data);

// ─────────────────────────────────────────────────────────────
// AVATAR — solo local (el backend no tiene este campo aún)
// ─────────────────────────────────────────────────────────────

const AVATAR_KEY = "kelab_user_avatar";

export const saveLocalAvatar = (dataUrl: string): void => {
  try { localStorage.setItem(AVATAR_KEY, dataUrl); } catch { /* noop */ }
};

export const getLocalAvatar = (): string | null => {
  try { return localStorage.getItem(AVATAR_KEY); } catch { return null; }
};

export const clearLocalAvatar = (): void => {
  try { localStorage.removeItem(AVATAR_KEY); } catch { /* noop */ }
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export const getInitials = (nameOrEmail: string): string => {
  if (!nameOrEmail) return "?";
  const src = nameOrEmail.includes("@")
    ? nameOrEmail.split("@")[0]
    : nameOrEmail;
  return src
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
};

export const ACTOR_LABELS: Record<ActorType, string> = {
  RECICLADOR:      "Reciclador / Gestor",
  TRANSFORMADOR:   "Transformador / Productor",
  TRANSPORTADOR:   "Transportador",
  ADMIN_SECTORIAL: "Admin Sectorial",
  ADMIN_GENERAL:   "Admin General",
};

export const TIPO_PERSONA_LABELS: Record<TipoPersona, string> = {
  NATURAL:  "Persona Natural",
  JURIDICA: "Persona Jurídica",
};