#!/bin/bash

echo "======================================"
echo "VERITAS PREMIUM UI SYSTEM INSTALLER"
echo "======================================"

cd apps/web

echo ""
echo "Installing premium UI packages..."

pnpm add \
framer-motion \
lucide-react \
clsx \
tailwind-merge \
react-icons \
@radix-ui/react-dialog \
@radix-ui/react-dropdown-menu \
@radix-ui/react-tabs \
@radix-ui/react-toast \
@radix-ui/react-avatar

echo ""
echo "Creating folders..."

mkdir -p src/components/layout
mkdir -p src/components/auth
mkdir -p src/components/ui
mkdir -p src/components/dashboard
mkdir -p src/lib
mkdir -p src/styles

echo ""
echo "Creating utility file..."

cat > src/lib/utils.ts << 'EOF'
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
EOF

echo ""
echo "Creating premium globals.css..."

cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #07111f;
  --foreground: #ffffff;
  --card: rgba(10,20,40,0.82);
  --gold: #d4af37;
  --red: #a41212;
  --navy: #081120;
}

html {
  scroll-behavior: smooth;
}

body {
  background:
    radial-gradient(circle at top left, rgba(212,175,55,0.08), transparent 
30%),
    radial-gradient(circle at bottom right, rgba(164,18,18,0.12), 
transparent 30%),
    linear-gradient(to bottom, #050b16, #081120);
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
}

.veritas-glow {
  box-shadow:
    0 0 20px rgba(212,175,55,0.2),
    0 0 60px rgba(212,175,55,0.08);
}

.gold-text {
  background: linear-gradient(to right, #f7e7a1, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card {
  background: rgba(12,18,32,0.78);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.08);
}

.veritas-input {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  outline: none;
}

.veritas-input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 20px rgba(212,175,55,0.25);
}

.veritas-button {
  background: linear-gradient(to right, #b38728, #d4af37);
  color: black;
  font-weight: 700;
  padding: 14px 20px;
  border-radius: 14px;
  transition: 0.25s;
}

.veritas-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(212,175,55,0.35);
}
EOF

echo ""
echo "Creating premium navbar..."

cat > src/components/layout/NavBar.tsx << 'EOF'
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
EOF

echo ""
echo "Creating premium login screen..."

cat > src/components/auth/LoginScreen.tsx << 'EOF'
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
EOF

echo ""
echo "Creating homepage..."

cat > src/app/page.tsx << 'EOF'
import NavBar from "@/components/layout/NavBar";
import LoginScreen from "@/components/auth/LoginScreen";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <LoginScreen />
    </main>
  );
}
EOF

echo ""
echo "======================================"
echo "VERITAS PREMIUM UI INSTALLED"
echo "======================================"
echo ""
echo "NEXT:"
echo "1. Add your logo image:"
echo "apps/web/public/veritas-logo.png"
echo ""
echo "2. Run:"
echo "cd apps/web"
echo "pnpm dev"
echo ""
