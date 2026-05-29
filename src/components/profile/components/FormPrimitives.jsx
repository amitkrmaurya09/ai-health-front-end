export const FormLabel = ({ children, required }) => (
  <label className="block text-sm font-semibold text-slate-700 mb-2">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

export const FormGroup = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);
