import Cookies from "js-cookie";

/**
 * getToken — busca el token en Cookies primero, luego en localStorage.
 * Esto resuelve el problema de tener tokens en dos lugares distintos.
 */
export const getToken = (): string => {
  const cookieToken = Cookies.get("token");
  if (cookieToken) return cookieToken;

  if (typeof window !== "undefined") {
    const lsToken = localStorage.getItem("token");
    if (lsToken) return lsToken;
  }

  return "";
};

/**
 * getRole — devuelve el rol del usuario desde las cookies o localStorage
 */
export const getRole = (): string => {
  const cookieRole = Cookies.get("roles");
  if (cookieRole) {
    try {
      const roles = JSON.parse(decodeURIComponent(cookieRole));
      return Array.isArray(roles) ? roles[0] : roles;
    } catch {
      return cookieRole;
    }
  }
  return "";
};

/**
 * isAdmin — verifica si el usuario actual es ADMIN
 */
export const isAdmin = (): boolean => {
  const role = getRole();
  return role.includes("ROLE_ADMIN") || role.includes("ADMIN");
};