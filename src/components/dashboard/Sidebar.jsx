import { Heart, Droplets, TrendingUp } from "lucide-react";
import { formatBloodPressure } from "../../utils";

// ─── InsightsPanel ────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  success: {
    badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    dot: "bg-emerald-500",
    tip: "border-l-2 border-emerald-500/40 pl-3",
  },
  warning: {
    badge: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    dot: "bg-amber-500",
    tip: "border-l-2 border-amber-500/40 pl-3",
  },
  neutral: {
    badge: "bg-slate-700/60 border-slate-600/40 text-slate-400",
    dot: "bg-slate-500",
    tip: "border-l-2 border-slate-600/40 pl-3",
  },
};

export function InsightsPanel({ insight }) {
  const style = STATUS_STYLES[insight?.statusClass ?? "neutral"];

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-violet-400" />
        <h3 className="font-bold text-slate-200 text-sm">Insights</h3>
      </div>

      {insight?.status && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold mb-4 ${style.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {insight.status}
        </div>
      )}

      <ul className="space-y-3">
        {insight?.tips?.map((tip, i) => (
          <li
            key={i}
            className={`${style.tip} text-slate-400 text-xs leading-relaxed py-0.5`}
          >
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── VitalsPanel ──────────────────────────────────────────────────────────────

const VITAL_ITEMS = [
  {
    label: "Heart Rate",
    key: "heart_rate",
    unit: "bpm",
    icon: <Heart size={14} className="text-rose-400" />,
    format: (v) => v ?? "—",
  },
  {
    label: "Blood Pressure",
    key: "blood_pressure",
    unit: "",
    icon: <span className="text-xs text-orange-400 font-bold">BP</span>,
    format: formatBloodPressure,
  },
  {
    label: "Weight",
    key: "weight",
    unit: "kg",
    icon: <span className="text-xs text-cyan-400 font-bold">Wt</span>,
    format: (v) => v ?? "—",
  },
  {
    label: "Water",
    key: "water_intake_liters",
    unit: "L",
    icon: <Droplets size={14} className="text-blue-400" />,
    format: (v) => v ?? "—",
  },
];

export function VitalsPanel({ data }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
      <h3 className="font-bold text-slate-200 text-sm mb-4">Vitals</h3>
      <ul className="space-y-3">
        {VITAL_ITEMS.map((item) => {
          const raw = data?.[item.key];
          const display = item.format(raw);
          const hasValue = raw != null && raw !== "";

          return (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-slate-500 text-xs">{item.label}</span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  hasValue ? "text-slate-200" : "text-slate-600"
                }`}
              >
                {display}
                {hasValue && item.unit && (
                  <span className="text-slate-500 font-normal ml-1 text-xs">
                    {item.unit}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
