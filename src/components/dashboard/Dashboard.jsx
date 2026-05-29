import { useState } from "react";
import { Activity, Flame, Wind, Moon } from "lucide-react";

import { useHealthData } from "../../hooks/useHealthData";
import { DATA_SOURCES } from "../../constants";

import { DashboardHeader } from "./DashboardHeader";
import { ActivityChart } from "./ActivityChart";
import { HistoryTable } from "./HistoryTable";
import { InsightsPanel, VitalsPanel } from "./Sidebar";
import { MetricCard, EmptyState, LoadingScreen, SyncError } from "../ui";
import { ManualEntryModal } from "../modals/ManualEntryModal";

const METRIC_CARDS = [
  {
    key: "step_count",
    label: "Steps",
    unit: "steps",
    icon: <Activity size={18} />,
    accent: "blue",
  },
  {
    key: "calories_burned",
    label: "Calories",
    unit: "kcal",
    icon: <Flame size={18} />,
    accent: "orange",
  },
  {
    key: "active_minutes",
    label: "Active",
    unit: "min",
    icon: <Wind size={18} />,
    accent: "cyan",
  },
  {
    key: "sleep_hours",
    label: "Sleep",
    unit: "hrs",
    icon: <Moon size={18} />,
    accent: "indigo",
  },
];

export default function Dashboard() {
  const {
    loading,
    syncing,
    syncError,
    activeSource,
    displayHistory,
    latest,
    insight,
    userData,
    googleData,
    toggleSource,
    saveManualEntry,
    fetchGoogleData,
    connectGoogle,
  } = useHealthData();

  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <LoadingScreen />;

  const hasData = displayHistory.length > 0;
  const googleDataEmpty = googleData.length === 0;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans">
      {/* Subtle background grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-5">

        {/* Header */}
        <DashboardHeader
          userData={userData}
          activeSource={activeSource}
          latest={latest}
          syncing={syncing}
          googleDataEmpty={googleDataEmpty}
          onToggleSource={toggleSource}
          onAddEntry={() => setModalOpen(true)}
          onRefresh={fetchGoogleData}
          onConnect={connectGoogle}
        />

        {/* Sync error banner */}
        <SyncError message={syncError} />

        {/* Empty state */}
        {!hasData && (
          <EmptyState
            source={activeSource}
            onAdd={() => setModalOpen(true)}
            onConnect={connectGoogle}
          />
        )}

        {/* Main content */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

            {/* Left / main column */}
            <div className="lg:col-span-3 space-y-5">

              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {METRIC_CARDS.map(({ key, label, unit, icon, accent }) => (
                  <MetricCard
                    key={key}
                    label={label}
                    value={latest?.[key]}
                    unit={unit}
                    icon={icon}
                    accentColor={accent}
                  />
                ))}
              </div>

              {/* Chart */}
              <ActivityChart data={displayHistory} activeSource={activeSource} />

              {/* History table */}
              <HistoryTable history={displayHistory} activeSource={activeSource} />
            </div>

            {/* Right / sidebar */}
            <div className="space-y-5">
              <InsightsPanel insight={insight} />
              <VitalsPanel data={latest} />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ManualEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveManualEntry}
        initialData={activeSource === DATA_SOURCES.MANUAL ? latest : null}
      />
    </div>
  );
}
