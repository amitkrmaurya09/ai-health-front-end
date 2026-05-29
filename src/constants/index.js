export const BACKEND_URL = "http://localhost:8000";

export const DATA_SOURCES = {
  MANUAL: "manual",
  GOOGLE: "google",
};

export const STORAGE_KEYS = {
  ACTIVE_SOURCE: "activeSource",
  MANUAL_DATA: "manual_health_data",
  USER_PROFILE: "userProfile",
};

export const THRESHOLDS = {
  STEPS_GOOD: 5000,
  SLEEP_MIN: 6,
  SLEEP_GOOD: 7,
  WATER_MIN: 2,
};

export const CHART_COLORS = {
  [DATA_SOURCES.GOOGLE]: "#6366f1",
  [DATA_SOURCES.MANUAL]: "#10b981",
};

export const METRIC_KEYS = {
  STEPS: "step_count",
  CALORIES: "calories_burned",
  ACTIVE: "active_minutes",
  SLEEP: "sleep_hours",
  HEART_RATE: "heart_rate",
  BLOOD_PRESSURE: "blood_pressure",
  WEIGHT: "weight",
  WATER: "water_intake_liters",
};
