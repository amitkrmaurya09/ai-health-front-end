import { Database, Smartphone, PlusCircle, RefreshCw } from "lucide-react";
import { DATA_SOURCES } from "../../constants";
import { getAvatarUrl } from "../../utils";
import { Badge } from "../ui";

export function DashboardHeader({
  userData,
  activeSource,
  latest,
  syncing,
  googleDataEmpty,
  onToggleSource,
  onAddEntry,
  onRefresh,
  onConnect,
}) {
  return (
    <header className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-6 py-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

        {/* ── Profile ── */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={getAvatarUrl(userData.name, userData.photo)}
              alt={userData.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700/60"
              onError={(e) => {
                e.target.src = getAvatarUrl(userData.name, null);
              }}
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-bold text-white truncate">
                {userData.name}
              </h1>
              <Badge source={activeSource} />
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Last updated:{" "}
              <span className="text-slate-400">{latest?.date ?? "No data"}</span>
            </p>
          </div>
        </div>

        {/* ── Source Toggle ── */}
        <div className="flex bg-slate-800/70 p-1 rounded-xl border border-slate-700/50 gap-1">
          <ToggleBtn
            active={activeSource === DATA_SOURCES.MANUAL}
            onClick={() => onToggleSource(DATA_SOURCES.MANUAL)}
            icon={<Database size={14} />}
            label="Manual"
            activeClass="bg-slate-700 text-white"
          />
          <ToggleBtn
            active={activeSource === DATA_SOURCES.GOOGLE}
            onClick={() => onToggleSource(DATA_SOURCES.GOOGLE)}
            icon={<Smartphone size={14} />}
            label="Google Fit"
            activeClass="bg-indigo-600 text-white"
          />
        </div>

        {/* ── Action Button ── */}
        <div className="flex-shrink-0">
          {activeSource === DATA_SOURCES.MANUAL ? (
            <button
              onClick={onAddEntry}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            >
              <PlusCircle size={16} />
              Add Entry
            </button>
          ) : (
            <button
              onClick={googleDataEmpty ? onConnect : onRefresh}
              disabled={syncing}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700/60 transition-all duration-150"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
              {googleDataEmpty ? "Connect" : syncing ? "Syncing…" : "Refresh"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function ToggleBtn({ active, onClick, icon, label, activeClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
        active ? activeClass : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
