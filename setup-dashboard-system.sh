#!/bin/bash

echo "========================================="
echo "VERITAS DASHBOARD SYSTEM INSTALLER"
echo "========================================="

cd apps/web

echo ""
echo "Installing dashboard dependencies..."

pnpm add \
recharts \
react-countup \
date-fns

echo ""
echo "Creating folders..."

mkdir -p src/components/dashboard
mkdir -p src/components/cards
mkdir -p src/components/activity
mkdir -p src/components/sidebar
mkdir -p src/components/topbar
mkdir -p src/app/dashboard

echo ""
echo "Creating Sidebar..."

cat > src/components/sidebar/Sidebar.tsx << 'EOF'
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
EOF

echo ""
echo "Creating TopBar..."

cat > src/components/topbar/TopBar.tsx << 'EOF'
"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar() {
  return (
    <div className="h-24 flex items-center justify-between px-8 border-b 
border-white/10">

      <div>
        <h1 className="text-3xl font-bold gold-text">
          Welcome Back
        </h1>

        <p className="text-white/50">
          Secure Trust Infrastructure
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-4 text-white/40"
          />

          <input
            placeholder="Search..."
            className="pl-11 pr-5 py-3 rounded-2xl bg-white/5 border 
border-white/10 outline-none text-white"
          />

        </div>

        <button className="w-12 h-12 rounded-2xl bg-white/5 border 
border-white/10 flex items-center justify-center">
          <Bell />
        </button>

      </div>

    </div>
  );
}
EOF

echo ""
echo "Creating StatsCard..."

cat > src/components/cards/StatsCard.tsx << 'EOF'
"use client";

import CountUp from "react-countup";

interface Props {
  title: string;
  value: number;
  suffix?: string;
}

export default function StatsCard({
  title,
  value,
  suffix,
}: Props) {
  return (
    <div className="glass-card rounded-3xl p-7 veritas-glow">

      <p className="text-white/50 mb-3">
        {title}
      </p>

      <h2 className="text-5xl font-bold gold-text">
        <CountUp end={value} duration={2} />
        {suffix}
      </h2>

    </div>
  );
}
EOF

echo ""
echo "Creating ActivityFeed..."

cat > src/components/activity/ActivityFeed.tsx << 'EOF'
const items = [
  "Escrow funded successfully",
  "AI trust scan completed",
  "Worker verified identity",
  "Dispute resolved",
  "Wallet secured with multi-signature",
];

export default function ActivityFeed() {
  return (
    <div className="glass-card rounded-3xl p-7">

      <h2 className="text-2xl font-bold gold-text mb-6">
        Live Activity
      </h2>

      <div className="space-y-4">

        {items.map((item, i) => (
          <div
            key={i}
            className="border border-white/5 bg-white/5 rounded-2xl p-4"
          >
            <p className="text-white/80">
              {item}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}
EOF

echo ""
echo "Creating dashboard page..."

cat > src/app/dashboard/page.tsx << 'EOF'
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/topbar/TopBar";
import StatsCard from "@/components/cards/StatsCard";
import ActivityFeed from "@/components/activity/ActivityFeed";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen">

      <Sidebar />

      <section className="flex-1">

        <TopBar />

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <StatsCard
              title="Trust Score"
              value={98}
            />

            <StatsCard
              title="Escrow Protected"
              value={245000}
              suffix="$"
            />

            <StatsCard
              title="Resolved Cases"
              value={1248}
            />

          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            <ActivityFeed />

            <div className="glass-card rounded-3xl p-8">

              <h2 className="text-2xl font-bold gold-text mb-6">
                AI Trust Engine
              </h2>

              <div className="space-y-5">

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Identity Verification</span>
                    <span>99%</span>
                  </div>

                  <div className="h-4 rounded-full bg-white/10 
overflow-hidden">
                    <div className="h-full w-[99%] bg-yellow-500 
rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Fraud Detection</span>
                    <span>96%</span>
                  </div>

                  <div className="h-4 rounded-full bg-white/10 
overflow-hidden">
                    <div className="h-full w-[96%] bg-red-600 
rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Trust Compliance</span>
                    <span>98%</span>
                  </div>

                  <div className="h-4 rounded-full bg-white/10 
overflow-hidden">
                    <div className="h-full w-[98%] bg-green-500 
rounded-full"></div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
EOF

echo ""
echo "Creating route redirect..."

cat > src/app/page.tsx << 'EOF'
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
EOF

echo ""
echo "========================================="
echo "VERITAS DASHBOARD INSTALLED"
echo "========================================="
echo ""
echo "RUN:"
echo "cd apps/web"
echo "pnpm dev"
