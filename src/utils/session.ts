import Cookies from "js-cookie";

const TOKEN_KEY     = "token";
const LAST_ACTIVE   = "last_active";
const INACTIVITY_MS = 30 * 60 * 1000;
let   destroying    = false;

export const session = {

  set(token: string, userData?: object) {
    Cookies.set(TOKEN_KEY, token, {
      expires: 1 / 3, // 8 horas
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    localStorage.setItem(LAST_ACTIVE, String(Date.now()));
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    destroying = false;
  },

  get(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  touch() {
    if (this.get()) localStorage.setItem(LAST_ACTIVE, String(Date.now()));
  },

  isExpiredByInactivity(): boolean {
    const last = localStorage.getItem(LAST_ACTIVE);
    if (!last) return true;
    return Date.now() - Number(last) > INACTIVITY_MS;
  },

  getRoles(): string[] {
    try {
      const user = localStorage.getItem("user");
      if (!user) return [];
      return JSON.parse(user).roles ?? [];
    } catch { return []; }
  },

  isUser(): boolean {
    const roles = this.getRoles();
    return roles.includes("ROLE_USER") && !roles.includes("ROLE_ADMIN");
  },

  destroy() {
    if (destroying) return;
    destroying = true;
    Cookies.remove(TOKEN_KEY, { path: "/" });
    localStorage.removeItem(LAST_ACTIVE);
    localStorage.removeItem("user");
    window.location.replace("/signin");
  },
};