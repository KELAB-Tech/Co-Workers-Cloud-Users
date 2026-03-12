"use client";
import Image from "next/image";
import CountryMap from "./CountryMap";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">

      {/* HEADER */}

      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Clientes por país
          </h3>

          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Distribución geográfica de clientes
          </p>
        </div>

        <div className="relative inline-block">

          <button onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">

            <DropdownItem onItemClick={closeDropdown}>
              Ver reporte
            </DropdownItem>

            <DropdownItem onItemClick={closeDropdown}>
              Exportar
            </DropdownItem>

          </Dropdown>

        </div>
      </div>

      {/* MAPA */}

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="mapOne -mx-4 -my-6 h-[212px] w-full">
          <CountryMap />
        </div>
      </div>

      {/* LISTA */}

      <div className="space-y-5">

        {/* Colombia */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Image
              width={40}
              height={40}
              src="/images/country/colombia.svg"
              alt="colombia"
            />

            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white">
                Colombia
              </p>

              <span className="text-gray-500 text-xs dark:text-gray-400">
                1,540 clientes
              </span>

            </div>

          </div>

          <div className="flex items-center gap-3 w-[140px]">

            <div className="relative w-full h-2 bg-gray-200 rounded dark:bg-gray-800">

              <div className="absolute left-0 top-0 h-full w-[65%] rounded bg-[#45C93E]" />

            </div>

            <span className="text-sm font-medium text-gray-800 dark:text-white">
              65%
            </span>

          </div>

        </div>

        {/* México */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Image
              width={40}
              height={40}
              src="/images/country/mexico.svg"
              alt="mexico"
            />

            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white">
                México
              </p>

              <span className="text-gray-500 text-xs dark:text-gray-400">
                420 clientes
              </span>

            </div>

          </div>

          <div className="flex items-center gap-3 w-[140px]">

            <div className="relative w-full h-2 bg-gray-200 rounded dark:bg-gray-800">

              <div className="absolute left-0 top-0 h-full w-[18%] rounded bg-[#45C93E]" />

            </div>

            <span className="text-sm font-medium text-gray-800 dark:text-white">
              18%
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}