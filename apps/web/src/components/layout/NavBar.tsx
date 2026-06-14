"use client";

import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 
backdrop-blur-xl bg-black/30"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center 
justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/veritas-logo.png"
            alt="Veritas"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-3xl italic gold-text tracking-widest">
            VERITAS
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm 
text-white/80">
          <a href="#">Dashboard</a>
          <a href="#">Escrow</a>
          <a href="#">Trust</a>
          <a href="#">Security</a>
        </nav>
      </div>
    </motion.header>
  );
}
