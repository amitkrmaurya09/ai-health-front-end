import { Activity } from "lucide-react";
import { DATA_SOURCES } from "../../constants";
import { formatNumber, formatDateShort } from "../../utils";

const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "step_count", label: "Steps" },
  { key: "calories_burned", label: "Calories" },
  { key: "sleep_hours", label: "Sleep" },
  { key: "source", label: "Source" },
];

export function HistoryTable({ history, activeSource }) {
  const rows = [...history].reverse().slice(0, 7);
  const isGoogle = activeSource === DATA_SOURCES.GOOGLE;

  if (rows.length === 0) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 overflow-hidden">
      <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 mb-5">
        <Activity size={16} className="text-violet-400" />
        Recent Entries
      </h3>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-slate-800">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="pb-3 px-2 first:pl-0 last:pr-0 text-slate-500 text-xs font-bold uppercase tracking-widest"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((day, i) => (
              <HistoryRow key={day.date ?? i} day={day} isGoogle={isGoogle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryRow({ day, isGoogle }) {
  const goodSteps = (day.step_count ?? 0) >= 5000;
  const goodSleep = (day.sleep_hours ?? 0) >= 7;

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
      <td className="py-3.5 px-2 first:pl-0 font-medium text-slate-300 whitespace-nowrap">
        {formatDateShort(day.date) || day.date}
      </td>
      <td className="py-3.5 px-2">
        <span
          className={`font-semibold ${
            goodSteps ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          {formatNumber(day.step_count)}
        </span>
      </td>
      <td className="py-3.5 px-2 text-slate-400">
        {day.calories_burned ? `${day.calories_burned} kcal` : "—"}
      </td>
      <td className="py-3.5 px-2">
        <span className={goodSleep ? "text-indigo-400" : "text-slate-500"}>
          {day.sleep_hours ? `${day.sleep_hours} hrs` : "—"}
        </span>
      </td>
      <td className="py-3.5 px-2 last:pr-0">
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${
            isGoogle
              ? "border-indigo-500/30 text-indigo-400 bg-indigo-500/5"
              : "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
          }`}
        >
          {isGoogle ? "Fit" : "Manual"}
        </span>
      </td>
    </tr>
  );
}
