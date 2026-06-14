"use client";

import { motion } from "framer-motion";

export default function LoginScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center 
px-6 overflow-hidden">

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] 
bg-yellow-500 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] 
bg-red-700 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass-card veritas-glow 
rounded-3xl p-10"
      >
        <div className="flex flex-col items-center text-center">

          <img
            src="/veritas-logo.png"
            alt="Veritas"
            className="w-28 mb-5"
          />

          <h1 className="text-5xl italic gold-text mb-3">
            VERITAS
          </h1>

          <p className="text-white/70 mb-8">
            Secure Trust Infrastructure
          </p>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username or Email"
            className="veritas-input"
          />

          <input
            type="password"
            placeholder="Password"
            className="veritas-input"
          />

          <button className="veritas-button w-full">
            Secure Login
          </button>

        </div>

        <div className="mt-6 flex justify-between text-sm text-white/60">
          <button>Forgot Username</button>
          <button>Forgot Password</button>
        </div>

        <button className="mt-6 w-full border border-yellow-500/30 
rounded-xl py-3 text-yellow-400 hover:bg-yellow-500/10 transition">
          Create Account
        </button>

      </motion.div>
    </div>
  );
}
