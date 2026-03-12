"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";

import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";
import { Store, Package, ShoppingCart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900">

          {children}

          {/* RIGHT SIDE */}
          <div
            className="lg:w-1/2 w-full h-full hidden lg:flex items-center justify-center
            bg-gradient-to-br
            from-[#000180]
            via-[#02026b]
            to-[#00003a]
            dark:from-[#000180]
            dark:via-[#01014a]
            dark:to-black
            relative overflow-hidden"
          >

            {/* Floating Particles */}
            <FloatingParticles />

            {/* Glow background */}
            <motion.div
              className="absolute w-[500px] h-[500px] bg-[#45C93E]/10 blur-[120px] rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
            />

            {/* Animated Grid */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute inset-0"
            >
              <GridShape />
            </motion.div>

            {/* CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-col items-center text-center px-10 max-w-lg"
            >
              {/* IMAGE */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-10"
              >
                <Image
                  width={300}
                  height={300}
                  src="/images/login/store.svg"
                  alt="Panel administración"
                  className="drop-shadow-[0_20px_40px_rgba(69,201,62,0.35)]"
                />
              </motion.div>

              {/* TITLE */}
              <h2 className="text-3xl font-bold text-white mb-4">
                Bienvenido al panel de gestión
              </h2>

              {/* DESCRIPTION */}
              <p className="text-blue-100 dark:text-gray-300 text-lg leading-relaxed mb-8">
                Administra tu tienda, productos y pedidos desde un solo lugar.
              </p>

              {/* FEATURES */}
              <div className="space-y-4 text-left">

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-white"
                >
                  <Store className="text-[#45C93E]" size={20} />
                  <span>Gestiona tus tiendas</span>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-white"
                >
                  <Package className="text-[#45C93E]" size={20} />
                  <span>Administra tus productos</span>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-white"
                >
                  <ShoppingCart className="text-[#45C93E]" size={20} />
                  <span>Controla pedidos y ventas</span>
                </motion.div>

              </div>

              {/* DOTS */}
              <div className="flex gap-3 mt-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#45C93E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#45C93E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#45C93E]" />
              </div>

            </motion.div>
          </div>

          {/* THEME TOGGLE */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>

        </div>
      </ThemeProvider>
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 12 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 bg-[#45C93E]/40 rounded-full"
          initial={{
            x: Math.random() * 800,
            y: Math.random() * 600,
            opacity: 0.2,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}