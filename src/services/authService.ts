import { session } from "@/utils/session";

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  const res = await fetch("https://backend-co-workers-cloud.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Credenciales inválidas");
  }

  const result = await res.json();

  if (!result?.token) {
    throw new Error("No se recibió token del servidor");
  }

  const roles: string[] = result.roles ?? [];

  // ✅ Bloquear admins — que usen el panel admin
  if (roles.includes("ROLE_ADMIN")) {
    throw new Error("Esta plataforma es para empresas. Los administradores deben usar el panel de administración.");
  }

  // ✅ Solo usuarios normales
  if (!roles.includes("ROLE_USER")) {
    throw new Error("No tienes permisos para acceder a esta plataforma.");
  }

  session.set(result.token, {
    email:       result.email,
    roles:       result.roles,
    actorType:   result.actorType,
    tipoPersona: result.tipoPersona,
  });

  return result;
};