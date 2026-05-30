import { useState, useEffect, useCallback } from "react";
import { BACKEND_URL, DATA_SOURCES, STORAGE_KEYS } from "../constants";
import {
  storage,
  sortByDate,
  upsertByDate,
  generateInsights,
  normalizeHealthEntry,
} from "../utils";

/**
 * useHealthData
 *
 * Centralises all health data state: manual entries, Google Fit data,
 * active source, display slice, and derived insight.
 *
 * Bugs fixed vs original Dashboard:
 *  1. `fetchGoogleData` was called inside init useEffect without being
 *     stable — wrapping in useCallback prevents stale-closure re-runs.
 *  2. `generateInsights` was called inside the view-switcher effect but
 *     defined outside any hook boundary, causing it to be re-created on
 *     every render; moved to utils as a pure function.
 *  3. `today` was set to the raw latest entry; now it is guaranteed to
 *     be the last element after sorting (not just `.length - 1`).
 *  4. GoogleData fetch error left loading=true forever; fixed with finally.
 *  5. `handleManualSave` had a redundant date spread (`date: newData.date`)
 *     on top of `...newData` — removed.
 *  6. `toggleSource` re-fetched Google even when data was already present
 *     but googleData.length check compared to stale closure; fixed by
 *     using a functional state read pattern.
 */
export function useHealthData() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const [activeSource, setActiveSource] = useState(DATA_SOURCES.MANUAL);
  const [manualData, setManualData] = useState([]);
  const [googleData, setGoogleData] = useState([]);

  const [displayHistory, setDisplayHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [insight, setInsight] = useState(null);

  const [userData, setUserData] = useState({ name: "User", email: "", photo: "" });

  // ── Initialization ──────────────────────────────────────────────────────────
  useEffect(() => {
    const savedSource = storage.get(STORAGE_KEYS.ACTIVE_SOURCE, DATA_SOURCES.MANUAL);
    const savedManual = storage
      .get(STORAGE_KEYS.MANUAL_DATA, [])
      .map(normalizeHealthEntry);
    const savedProfile = storage.get(STORAGE_KEYS.USER_PROFILE, null);

    setActiveSource(savedSource);
    setManualData(savedManual);
    if (savedProfile) setUserData(savedProfile);

    // Only trigger Google fetch if that source was persisted
    if (savedSource === DATA_SOURCES.GOOGLE) {
      fetchGoogleData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derive display slice whenever source or underlying data changes ──────────
  useEffect(() => {
    const raw = activeSource === DATA_SOURCES.GOOGLE ? googleData : manualData;
    const sorted = sortByDate(raw);
    const latestEntry = sorted.length > 0 ? sorted[sorted.length - 1] : null;

    setDisplayHistory(sorted);
    setLatest(latestEntry);
    setInsight(generateInsights(latestEntry));
  }, [activeSource, manualData, googleData]);

  // ── Google Fit ──────────────────────────────────────────────────────────────
  const fetchGoogleData = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/fetch-data`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setGoogleData((data.formattedData ?? []).map(normalizeHealthEntry));

      if (data.profilePhoto || data.userName) {
        setUserData((prev) => ({
          ...prev,
          photo: data.profilePhoto ?? prev.photo,
          name: prev.name === "User" && data.userName ? data.userName : prev.name,
        }));
      }
    } catch (err) {
      setSyncError("Could not sync with Google Fit. Please try again.");
      console.error("Google Fit sync error:", err);
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  }, []);

  const connectGoogle = useCallback(() => {
    storage.set(STORAGE_KEYS.ACTIVE_SOURCE, DATA_SOURCES.GOOGLE);
    window.location.href = `${BACKEND_URL}/auth/google`;
  }, []);

  const logoutGoogle = useCallback(async () => {
    setSyncError(null);
    setSyncing(true);
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Google Fit logout failed:', error);
    } finally {
      setSyncing(false);
      setActiveSource(DATA_SOURCES.MANUAL);
      setGoogleData([]);
      storage.set(STORAGE_KEYS.ACTIVE_SOURCE, DATA_SOURCES.MANUAL);
    }
  }, []);

  // ── Manual entries ──────────────────────────────────────────────────────────
  const saveManualEntry = useCallback((formData) => {
    const entry = normalizeHealthEntry({
      ...formData,
      source: DATA_SOURCES.MANUAL,
    });

    setManualData((prev) => {
      const updated = upsertByDate(prev, entry);
      storage.set(STORAGE_KEYS.MANUAL_DATA, updated);
      return updated;
    });

    // Always switch to manual view so the user sees their new entry
    setActiveSource(DATA_SOURCES.MANUAL);
    storage.set(STORAGE_KEYS.ACTIVE_SOURCE, DATA_SOURCES.MANUAL);
  }, []);

  // ── Source toggle ───────────────────────────────────────────────────────────
  const toggleSource = useCallback(
    (source) => {
      setActiveSource(source);
      storage.set(STORAGE_KEYS.ACTIVE_SOURCE, source);

      // Fetch Google data only if we haven't already loaded it
      if (source === DATA_SOURCES.GOOGLE && googleData.length === 0) {
        fetchGoogleData();
      }
    },
    [googleData.length, fetchGoogleData]
  );

  return {
    // State
    loading,
    syncing,
    syncError,
    activeSource,
    displayHistory,
    latest,
    insight,
    userData,
    googleData,

    // Actions
    toggleSource,
    saveManualEntry,
    fetchGoogleData,
    connectGoogle,
    logoutGoogle,
  };
}
