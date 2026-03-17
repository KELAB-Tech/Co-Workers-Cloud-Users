"use client";
import React, { useState, useEffect } from "react";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { getMyProfile, UserProfile } from "@/services/userService";
import { AlertCircle } from "lucide-react";

// ── Skeleton ──────────────────────────────────────────────────
function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
      <div className="h-5 w-40 rounded bg-gray-100 dark:bg-gray-800 mb-6" />
      <div className={`grid grid-cols-2 gap-4`}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(() => setError("No se pudo cargar el perfil. Intenta recargar la página."))
      .finally(() => setLoading(false));
  }, []);

  // onUpdate recibe el perfil actualizado del servidor y lo aplica localmente
  const handleUpdate = (updated: UserProfile) => setProfile(updated);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Mi perfil
        </h3>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 mb-6">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {loading || !profile ? (
            <>
              {/* Meta card skeleton — más alto por el avatar */}
              <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                  <div className="space-y-3">
                    <div className="h-5 w-44 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-3 w-28 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <CardSkeleton rows={6} />
              <CardSkeleton rows={4} />
            </>
          ) : (
            <>
              <UserMetaCard profile={profile} onUpdate={handleUpdate} />
              <UserInfoCard profile={profile} onUpdate={handleUpdate} />
              <UserAddressCard profile={profile} onUpdate={handleUpdate} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}