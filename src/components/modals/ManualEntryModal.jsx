import { useState, useEffect, useCallback } from "react";
import { X, Save } from "lucide-react";

const TODAY = new Date().toISOString().split("T")[0];

const DEFAULT_FORM = {
  date: TODAY,
  step_count: "",
  calories_burned: "",
  active_minutes: "",
  sleep_hours: "",
  heart_rate: "",
  blood_pressure: "",
  weight: "",
  water_intake_liters: "",
};

const FIELDS = [
  { key: "date", label: "Date", type: "date", required: true, col: "full" },
  { key: "step_count", label: "Steps", type: "number", placeholder: "e.g. 8000", col: "half" },
  { key: "calories_burned", label: "Calories (kcal)", type: "number", placeholder: "e.g. 450", col: "half" },
  { key: "active_minutes", label: "Active Minutes", type: "number", placeholder: "e.g. 45", col: "half" },
  { key: "sleep_hours", label: "Sleep (hrs)", type: "number", placeholder: "e.g. 7.5", step: "0.1", col: "half" },
  { key: "heart_rate", label: "Heart Rate (bpm)", type: "number", placeholder: "e.g. 72", col: "half" },
  { key: "blood_pressure", label: "Blood Pressure", type: "text", placeholder: "e.g. 120/80", col: "half" },
  { key: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70", step: "0.1", col: "half" },
  { key: "water_intake_liters", label: "Water (L)", type: "number", placeholder: "e.g. 2.5", step: "0.1", col: "half" },
];

/**
 * ManualEntryModal
 *
 * Fixes vs original:
 *  - Controlled inputs always have a defined value (never undefined → removes
 *    "uncontrolled → controlled" React warning)
 *  - Number parsing happens at save time, not during onChange
 *  - ESC key closes the modal
 *  - Scroll-locks <body> while open
 *  - initialData is applied on open, not on every render
 */
export function ManualEntryModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when modal opens (or initialData changes while open)
  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData
          ? {
              ...DEFAULT_FORM,
              ...Object.fromEntries(
                Object.entries(initialData).map(([k, v]) => [k, v ?? ""])
              ),
            }
          : { ...DEFAULT_FORM }
      );
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = "Date is required.";
    const hasAny = FIELDS.filter((f) => f.key !== "date").some(
      (f) => form[f.key] !== ""
    );
    if (!hasAny) errs._general = "Please fill in at least one metric.";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    // Parse numeric fields on save
    const parsed = { ...form };
    FIELDS.forEach(({ key, type, step }) => {
      if (type === "number" && parsed[key] !== "") {
        parsed[key] = step ? parseFloat(parsed[key]) : parseInt(parsed[key], 10);
      } else if (type === "number" && parsed[key] === "") {
        parsed[key] = null;
      }
    });

    onSave(parsed);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-slate-100">
              {initialData ? "Edit Entry" : "Add Health Entry"}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Track your daily metrics
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {errors._general && (
            <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {errors._general}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((field) => (
              <div
                key={field.key}
                className={field.col === "full" ? "col-span-2" : "col-span-1"}
              >
                <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  {field.label}
                  {field.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  step={field.step}
                  min={field.type === "number" ? "0" : undefined}
                  className={`w-full bg-slate-800/60 border rounded-xl px-3.5 py-2.5 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-1 transition-colors ${
                    errors[field.key]
                      ? "border-red-500/60 focus:ring-red-500/40"
                      : "border-slate-700/60 focus:border-indigo-500/60 focus:ring-indigo-500/30"
                  }`}
                />
                {errors[field.key] && (
                  <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all duration-150"
          >
            <Save size={15} />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
