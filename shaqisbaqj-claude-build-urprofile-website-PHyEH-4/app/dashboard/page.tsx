"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Nav from "@/components/Nav";
import { getSupabaseClient } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActivityEvent {
  date: string;
  device: string;
  city: string;
  country: string;
}

interface DashboardStats {
  totalViews: number;
  viewsThisWeek: number;
  avgWatchTime: number;
  contactClicks: number;
  chartData: { date: string; views: number }[];
  recentActivity: ActivityEvent[];
}

// ─── Demo data ────────────────────────────────────────────────────────────────
function generateDemoData(): DashboardStats {
  const now = new Date();
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const day = d.getDay();
    // Weekdays get more views
    const base = day === 0 || day === 6 ? 0 : 2;
    const noise = Math.floor(Math.random() * 4);
    const spike = i === 7 || i === 14 || i === 21 ? 3 : 0;
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: base + noise + spike,
    };
  });

  const recentActivity: ActivityEvent[] = [
    { date: "Today, 9:14 AM", device: "mobile", city: "Lexington Park", country: "US" },
    { date: "Today, 7:02 AM", device: "mobile", city: "Baltimore", country: "US" },
    { date: "Yesterday, 6:45 PM", device: "desktop", city: "Washington", country: "US" },
    { date: "Yesterday, 2:33 PM", device: "mobile", city: "Annapolis", country: "US" },
    { date: "Yesterday, 11:10 AM", device: "mobile", city: "Richmond", country: "US" },
    { date: "May 16, 4:58 PM", device: "desktop", city: "Charlotte", country: "US" },
    { date: "May 16, 1:22 PM", device: "mobile", city: "Lusby", country: "US" },
    { date: "May 15, 3:17 PM", device: "mobile", city: "Waldorf", country: "US" },
    { date: "May 15, 10:05 AM", device: "desktop", city: "New York", country: "US" },
    { date: "May 14, 5:30 PM", device: "mobile", city: "Atlanta", country: "US" },
  ];

  return {
    totalViews: 47,
    viewsThisWeek: 12,
    avgWatchTime: 73,
    contactClicks: 8,
    chartData,
    recentActivity,
  };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number | string;
  suffix?: string;
}) {
  return (
    <div className="border-t-2 border-ember pt-6 bg-cream">
      <p className="font-display font-light text-dark text-[clamp(2.5rem,4vw,3.5rem)] leading-none mb-3">
        {value}
        {suffix && (
          <span className="font-body text-base text-dark/30 ml-1">{suffix}</span>
        )}
      </p>
      <p className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30">
        {label}
      </p>
    </div>
  );
}

// ─── Weekly Insight ───────────────────────────────────────────────────────────
function WeeklyInsight({ stats }: { stats: DashboardStats }) {
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    const payload = {
      viewsThisWeek: stats.viewsThisWeek,
      totalViews: stats.totalViews,
      avgWatchTime: stats.avgWatchTime,
      contactClicks: stats.contactClicks,
      topDevices: "mobile",
    };

    fetch("/api/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => setInsight(data.insight))
      .catch(() =>
        setInsight(
          "Most of your views came from mobile this week — your NFC cards are working."
        )
      );
  }, [stats.viewsThisWeek, stats.totalViews, stats.avgWatchTime, stats.contactClicks]);

  return (
    <div className="border-l-2 border-ember pl-6 py-4">
      <p className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/30 mb-4">
        This week&apos;s insight
      </p>
      {insight ? (
        <p className="font-display font-light text-dark text-lg sm:text-xl italic leading-snug">
          &ldquo;{insight}&rdquo;
        </p>
      ) : (
        <div className="h-5 w-3/4 bg-dark/5 animate-pulse" />
      )}
      <p className="font-body text-[9px] tracking-[0.2em] uppercase text-dark/20 mt-4">
        Generated from your last 7 days of activity
      </p>
    </div>
  );
}

// ─── Device icon ──────────────────────────────────────────────────────────────
function DeviceIcon({ type }: { type: string }) {
  if (type === "mobile") {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-dark/30 shrink-0"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-dark/30 shrink-0"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-dark border border-white/10 px-4 py-2">
      <p className="font-body text-[9px] tracking-[0.2em] uppercase text-cream/40 mb-1">
        {label}
      </p>
      <p className="font-display text-cream text-xl leading-none">{payload[0].value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Your Profile");
  const [stats] = useState<DashboardStats>(generateDemoData());
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        // No Supabase configured — show demo dashboard
        setAuthChecked(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const email = session.user.email ?? "";
      const firstName = email.split("@")[0];
      setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
      setAuthChecked(true);
    }

    checkAuth();
  }, [router]);

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-dark/20">
          Loading…
        </p>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-cream pt-16">
        <div className="max-w-6xl mx-auto px-8 sm:px-12 py-20 sm:py-28">

          {/* Header */}
          <div className="mb-16">
            <h1 className="font-display font-light text-dark text-[clamp(2.4rem,5vw,3.5rem)] leading-none mb-3">
              {greeting}, {userName}
            </h1>
            <p className="font-body text-xs tracking-[0.18em] uppercase text-ember">
              Alex Rivera &middot; urprofile.com/alex
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mb-20">
            <StatCard label="Total Views" value={stats.totalViews} />
            <StatCard label="Views This Week" value={stats.viewsThisWeek} />
            <StatCard label="Avg Watch Time" value={stats.avgWatchTime} suffix="%" />
            <StatCard label="Contact Clicks" value={stats.contactClicks} />
          </div>

          {/* Chart */}
          <div className="mb-20">
            <p className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/25 mb-10">
              Profile views — last 30 days
            </p>
            <div className="border-t border-dark/10 pt-8">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={stats.chartData}
                  margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="rgba(28,26,24,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9,
                      fill: "rgba(28,26,24,0.25)",
                      letterSpacing: "0.15em",
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9,
                      fill: "rgba(28,26,24,0.25)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Line
                    type="linear"
                    dataKey="views"
                    stroke="#C4622D"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: "#C4622D", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 sm:gap-20 mb-24">

            {/* Recent activity */}
            <div>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/25 mb-8">
                Recent activity
              </p>
              <div className="border-t border-dark/10">
                {stats.recentActivity.map((event, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-4 border-b border-dark/[0.06] ${
                      i % 2 === 0 ? "bg-transparent" : "bg-cream/50"
                    }`}
                  >
                    <p className="font-body text-[10px] text-dark/35 w-36 shrink-0">
                      {event.date}
                    </p>
                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <DeviceIcon type={event.device} />
                      <p className="font-body text-[10px] tracking-[0.1em] uppercase text-dark/35">
                        {event.device}
                      </p>
                    </div>
                    <p className="font-body text-[10px] text-dark/35 text-right">
                      {event.city}, {event.country}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly insight */}
            <div>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase text-dark/25 mb-8">
                &nbsp;
              </p>
              <div className="border-t border-dark/10 pt-8">
                <WeeklyInsight stats={stats} />
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div className="border-t border-dark/10 pt-10">
            <button
              onClick={handleSignOut}
              className="font-body text-[10px] tracking-[0.2em] uppercase text-dark/20 hover:text-dark/40 transition-colors duration-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
