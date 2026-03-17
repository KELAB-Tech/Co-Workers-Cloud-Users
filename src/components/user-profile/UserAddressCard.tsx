"use client";
import React from "react";
import { UserProfile } from "@/services/userService";

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value || "—"}
      </p>
    </div>
  );
}

interface Props {
  profile: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}

export default function UserAddressCard({ profile }: Props) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Dirección y facturación
      </h4>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <InfoItem label="País" value="—" />
        <InfoItem label="Ciudad / Departamento" value="—" />
        <InfoItem label="Código postal" value="—" />
        <InfoItem label="NIT / TAX ID" value="—" />
      </div>
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
        Información de dirección no disponible aún.
      </p>
    </div>
  );
}