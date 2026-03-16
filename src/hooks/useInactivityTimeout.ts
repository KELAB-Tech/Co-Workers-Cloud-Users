"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { session } from "@/utils/session";

const INACTIVITY_MS = 30 * 60 * 1000; // 30 min
const WARNING_MS    = 28 * 60 * 1000; // 28 min
const EVENTS        = ["mousemove", "keydown", "click", "scroll", "touchstart"];

interface Options {
  onWarning?: () => void;
  onExpired?: () => void;
}

export function useInactivityTimeout({ onWarning, onExpired }: Options = {}) {
  const pathname        = usePathname();
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current)    clearTimeout(warningTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    session.touch();

    warningTimer.current = setTimeout(() => {
      onWarning?.();
    }, WARNING_MS);

    inactivityTimer.current = setTimeout(() => {
      onExpired?.();
      session.destroy();
    }, INACTIVITY_MS);
  }, [clearTimers, onWarning, onExpired]);

  useEffect(() => {
    // ✅ No activar en rutas públicas — evita el loop
    const publicRoutes = ["/signin"];
    if (publicRoutes.some((r) => pathname.startsWith(r))) return;

    // ✅ Si no hay token, no hacer nada — el proxy ya redirige
    if (!session.get()) return;

    // ✅ Si ya expiró por inactividad al volver a la pestaña
    if (session.isExpiredByInactivity()) {
      session.destroy();
      return;
    }

    resetTimers();

    EVENTS.forEach((e) =>
      window.addEventListener(e, resetTimers, { passive: true })
    );

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "last_active" && e.newValue === null) {
        session.destroy();
      }
    };
    window.addEventListener("storage", handleStorage);

    const handlePopState = () => {
      if (!session.get()) {
        history.pushState(null, "", "/signin");
        window.location.replace("/signin");
      }
    };
    window.addEventListener("popstate", handlePopState);
    history.pushState(null, "", window.location.href);

    return () => {
      clearTimers();
      EVENTS.forEach((e) => window.removeEventListener(e, resetTimers));
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, resetTimers, clearTimers]);
}