import { useState, useEffect } from "react";
import ToolHeader from "@/components/tool-header";

export default function WorldClock() {
  const [time, setTime] = useState(new Date());
  const ZONES = [
    { city: "New York", tz: "America/New_York", emoji: "🇺🇸" },
    { city: "London", tz: "Europe/London", emoji: "🇬🇧" },
    { city: "Paris", tz: "Europe/Paris", emoji: "🇫🇷" },
    { city: "Dubai", tz: "Asia/Dubai", emoji: "🇦🇪" },
    { city: "Dhaka", tz: "Asia/Dhaka", emoji: "🇧🇩" },
    { city: "Kolkata", tz: "Asia/Kolkata", emoji: "🇮🇳" },
    { city: "Bangkok", tz: "Asia/Bangkok", emoji: "🇹🇭" },
    { city: "Tokyo", tz: "Asia/Tokyo", emoji: "🇯🇵" },
    { city: "Sydney", tz: "Australia/Sydney", emoji: "🇦🇺" },
    { city: "Los Angeles", tz: "America/Los_Angeles", emoji: "🇺🇸" },
    { city: "Toronto", tz: "America/Toronto", emoji: "🇨🇦" },
    { city: "Karachi", tz: "Asia/Karachi", emoji: "🇵🇰" },
  ];
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);

  const fmt = (tz: string) => time.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fmtDate = (tz: string) => time.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ToolHeader title="World Clock" description="View the current time in major cities around the world — live updates." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ZONES.map(({ city, tz, emoji }) => (
          <div key={tz} className="flex items-center justify-between p-4 rounded-xl transition-all"
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-foreground)" }}>{emoji} {city}</p>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{fmtDate(tz)}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-lg" style={{ color: "var(--color-primary-light)" }}>{fmt(tz)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
