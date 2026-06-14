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
