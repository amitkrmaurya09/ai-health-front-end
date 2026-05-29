import { Calendar } from "lucide-react";
import { DATA_SOURCES } from "../../constants";
import { formatNumber } from "../../utils";

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({ source }) {
  const isGoogle = source === DATA_SOURCES.GOOGLE;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
        isGoogle
          ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400"
          : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isGoogle ? "bg-indigo-400" : "bg-emerald-400"
        }`}
      />
      {isGoogle ? "Google Fit" : "Manual"}
    </span>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

export function MetricCard({ label, value, unit, icon, accentColor = "blue" }) {
  const colorMap = {
    blue: "from-blue-500/10 to-transparent border-blue-500/20 text-blue-400",
    orange: "from-orange-500/10 to-transparent border-orange-500/20 text-orange-400",
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400",
    indigo: "from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-400",
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400",
  };

  const accent = colorMap[accentColor] ?? colorMap.blue;
  const [gradientClass, , borderClass, iconClass] = accent.split(" ");

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} via-slate-900/50 to-slate-900/80 border ${borderClass} rounded-2xl p-5 group hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-2.5 rounded-xl bg-slate-800/60 ${iconClass}`}
        >
          {icon}
        </div>
        <div className="w-12 h-0.5 rounded-full bg-slate-700/50 mt-3" />
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-white leading-none">
        {formatNumber(value, "—")}{" "}
        <span className="text-sm font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ source, onAdd, onConnect }) {
  const isGoogle = source === DATA_SOURCES.GOOGLE;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-5 border border-slate-700/40">
        <Calendar size={28} className="text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        {isGoogle ? "No Google Fit data" : "No manual entries yet"}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mb-6">
        {isGoogle
          ? "Connect your Google account to pull in your fitness data automatically."
          : "Start logging your daily health metrics to track progress over time."}
      </p>
      <button
        onClick={isGoogle ? onConnect : onAdd}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isGoogle
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : "bg-emerald-600 hover:bg-emerald-500 text-white"
        }`}
      >
        {isGoogle ? "Connect Google Fit" : "+ Add First Entry"}
      </button>
    </div>
  );
}

// ─── LoadingScreen ─────────────────────────────────────────────────────────────

export function LoadingScreen() {
  return (
    <div className="h-screen bg-[#080c14] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
        <div className="w-4 h-4 rounded-full bg-indigo-500" />
      </div>
      <p className="text-slate-500 text-sm tracking-wide">Loading your dashboard…</p>
    </div>
  );
}

// ─── SyncError ────────────────────────────────────────────────────────────────

export function SyncError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
      {message}
    </div>
  );
}
