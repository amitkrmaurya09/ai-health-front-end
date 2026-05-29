import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DATA_SOURCES, CHART_COLORS } from "../../constants";
import { formatDateShort } from "../../utils";

const GRADIENT_ID = "areaGradient";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-slate-700/60 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-semibold text-white">
          {Number(entry.value).toLocaleString()}{" "}
          <span className="text-slate-400 font-normal">{entry.name}</span>
        </p>
      ))}
    </div>
  );
}

export function ActivityChart({ data, activeSource }) {
  const color = CHART_COLORS[activeSource] ?? CHART_COLORS[DATA_SOURCES.MANUAL];
  const isGoogle = activeSource === DATA_SOURCES.GOOGLE;

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-100 text-base">Activity History</h3>
          <p className="text-slate-500 text-xs mt-0.5">Daily step count over time</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
            isGoogle
              ? "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
              : "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
          }`}
        >
          {isGoogle ? "Google Fit" : "Manual"}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDateShort}
            />
            <YAxis
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="step_count"
              name="steps"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${GRADIENT_ID})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: color,
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
