import { THRESHOLDS } from "../constants";

// ─── Storage Helpers ─────────────────────────────────────────────────────────

export const storage = {
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to write key "${key}" to localStorage`);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

// ─── Data Helpers ─────────────────────────────────────────────────────────────

/** Sort health entries by date ascending */
export const sortByDate = (entries = []) =>
  [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

/** Upsert an entry by date (used for manual saves) */
export const upsertByDate = (entries = [], newEntry) => {
  const filtered = entries.filter((e) => e.date !== newEntry.date);
  return [...filtered, newEntry];
};

/** Format blood pressure safely regardless of array/string input */
export const formatBloodPressure = (bp) => {
  if (!bp) return "--";
  if (Array.isArray(bp)) return bp.join("/");
  return String(bp);
};

/** Format a number to locale string, with a fallback */
export const formatNumber = (val, fallback = "--") =>
  val != null && !isNaN(val) ? Number(val).toLocaleString() : fallback;

/** Format a number as a whole number, with a fallback */
export const formatInteger = (val, fallback = "--") =>
  val != null && !isNaN(val) ? Math.round(Number(val)).toLocaleString() : fallback;

/** Keep dashboard metrics consistent across manual, cached, and Google data */
export const normalizeHealthEntry = (entry = {}) => ({
  ...entry,
  step_count:
    entry.step_count != null && entry.step_count !== ""
      ? Math.round(Number(entry.step_count))
      : entry.step_count,
  calories_burned:
    entry.calories_burned != null && entry.calories_burned !== ""
      ? Math.round(Number(entry.calories_burned))
      : entry.calories_burned,
  active_minutes:
    entry.active_minutes != null && entry.active_minutes !== ""
      ? Math.round(Number(entry.active_minutes))
      : entry.active_minutes,
  heart_rate:
    entry.heart_rate != null && entry.heart_rate !== ""
      ? Math.round(Number(entry.heart_rate))
      : entry.heart_rate,
});

/** Format a date string to a short label (e.g. "Jun 5") */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // already formatted or unknown
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Insights Generator ───────────────────────────────────────────────────────

/**
 * Generates insight object from the latest health entry.
 * Returns: { status, statusClass, tips }
 */
export const generateInsights = (data) => {
  if (!data) {
    return {
      status: "No Data",
      statusClass: "neutral",
      tips: ["Add an entry to see your insights here."],
    };
  }

  const tips = [];

  if (data.step_count != null && data.step_count < THRESHOLDS.STEPS_GOOD) {
    tips.push("Steps are low — try a 15-min walk after lunch.");
  }
  if (
    data.sleep_hours != null &&
    data.sleep_hours > 0 &&
    data.sleep_hours < THRESHOLDS.SLEEP_MIN
  ) {
    tips.push("Sleep under 6 hrs detected — aim for 7–9 hrs tonight.");
  }
  if (
    data.water_intake_liters != null &&
    data.water_intake_liters > 0 &&
    data.water_intake_liters < THRESHOLDS.WATER_MIN
  ) {
    tips.push("Hydration is low — drink 2–3 more glasses today.");
  }

  const hasConcerns = tips.length > 0;
  if (!hasConcerns) {
    tips.push("All metrics look great — keep up the momentum!");
  }

  return {
    status: hasConcerns ? "Needs Attention" : "On Track",
    statusClass: hasConcerns ? "warning" : "success",
    tips,
  };
};

// ─── Avatar URL ───────────────────────────────────────────────────────────────

export const getAvatarUrl = (name, photo) => {
  if (photo) return photo;
  const encoded = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encoded}&background=6366f1&color=fff&bold=true`;
};
