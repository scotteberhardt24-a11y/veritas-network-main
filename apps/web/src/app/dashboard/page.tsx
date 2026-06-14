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
