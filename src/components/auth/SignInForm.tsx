"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function SignInForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await fetch("https://backend-co-workers-cloud.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await res.json();

      // guardar token
      Cookies.set("token", data.token);

      // guardar info usuario
      Cookies.set("roles", JSON.stringify(data.roles));
      Cookies.set("actorType", data.actorType);

      // redirigir al inicio
      router.push("/");

    } catch (err: any) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full bg-white dark:bg-gray-900">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6">

        <div>

          {/* TITLE */}
          <div className="mb-6">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white">
              Iniciar sesión
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bienvenido de nuevo. Ingresa tus credenciales para acceder a tu panel.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">

              {/* EMAIL */}
              <div>
                <Label>
                  Usuario <span className="text-red-500">*</span>
                </Label>

                <Input
                  placeholder="correo@empresa.com"
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  className="
                  focus:border-[#45C93E]
                  focus:ring-[#45C93E]/30
                  dark:bg-gray-800
                  dark:border-gray-700
                  dark:text-white
                  "
                />
              </div>

              {/* PASSWORD */}
              <div>
                <Label>
                  Contraseña <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    className="
                    focus:border-[#45C93E]
                    focus:ring-[#45C93E]/30
                    dark:bg-gray-800
                    dark:border-gray-700
                    dark:text-white
                    "
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              {/* OPTIONS */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />

                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Recuérdame
                  </span>
                </div>

                <Link
                  href="#"
                  className="
                  text-sm
                  text-[#000180]
                  hover:text-[#45C93E]
                  dark:text-[#45C93E]
                  "
                >
                  Olvidé mi contraseña
                </Link>

              </div>

              {/* BUTTON */}
              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="
                  w-full
                  bg-[#45C93E]
                  hover:bg-[#3eb837]
                  text-white
                  border-none
                  "
                  size="sm"
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </Button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}