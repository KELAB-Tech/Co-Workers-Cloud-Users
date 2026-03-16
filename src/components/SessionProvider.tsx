"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { session } from "@/utils/session";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const [showWarning, setShowWarning] = useState(false);

  const isPublic = ["/signin"].some((r) => pathname.startsWith(r));

  // ✅ No activar en páginas públicas
  useInactivityTimeout(
    isPublic
      ? {}
      : {
          onWarning: () => setShowWarning(true),
          onExpired: () => setShowWarning(false),
        }
  );

  const handleKeepSession = () => {
    session.touch();
    setShowWarning(false);
  };

  return (
    <>
      {children}

      {/* Modal solo en rutas protegidas */}
      {!isPublic && showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800">

            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <svg className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">
              ¿Sigues ahí?
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Tu sesión cerrará en{" "}
              <strong className="text-yellow-600">2 minutos</strong>{" "}
              por inactividad.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => session.destroy()}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-transparent dark:border-gray-600"
              >
                Cerrar sesión
              </button>
              <button
                onClick={handleKeepSession}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}