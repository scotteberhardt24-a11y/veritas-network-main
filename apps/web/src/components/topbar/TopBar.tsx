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
