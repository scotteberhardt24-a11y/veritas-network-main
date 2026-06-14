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
