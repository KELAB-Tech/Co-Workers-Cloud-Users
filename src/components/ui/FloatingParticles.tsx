"use client";

import { motion } from "framer-motion";

export default function FloatingParticles() {
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