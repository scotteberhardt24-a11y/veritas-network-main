"use client";

import {
  Shield,
  LayoutDashboard,
  Wallet,
  Briefcase,
  Scale,
  Radio,
  Settings,
  Bot,
} from "lucide-react";

const links = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Wallet, label: "Escrow Vault" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Scale, label: "Disputes" },
  { icon: Radio, label: "Live Activity" },
  { icon: Bot, label: "AI Trust" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-[290px] min-h-screen border-r border-white/10 
bg-black/30 backdrop-blur-xl p-6 hidden lg:block">

      <div className="flex items-center gap-4 mb-14">
        <img
          src="/veritas-logo.png"
          className="w-14 h-14 object-contain"
        />

        <div>
          <h1 className="text-3xl italic gold-text">
            VERITAS
          </h1>

          <p className="text-xs text-white/50">
            TRUST LEDGER
          </p>
        </div>
      </div>

      <div className="space-y-3">

        {links.map((item, i) => {
          const Icon = item.icon;

          return (
            <button
              key={i}
              className="w-full flex items-center gap-4 px-5 py-4 
rounded-2xl text-white/80 hover:bg-yellow-500/10 hover:text-yellow-400 
transition"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}

      </div>

      <div className="mt-12 glass-card rounded-3xl p-5">

        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-yellow-400" />
          <h2 className="font-semibold">
            Trust Score
          </h2>
        </div>

        <div className="text-5xl font-bold gold-text">
          98
        </div>

        <p className="text-sm text-white/60 mt-3">
          Elite Verified Status
        </p>

      </div>

    </aside>
  );
}
