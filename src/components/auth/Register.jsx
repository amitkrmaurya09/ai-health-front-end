import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' // ✅ default
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      return setStatus({
        loading: false,
        error: "Passwords do not match",
        message: "",
      });
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role // ✅ ADD THIS
      });

      if (result.success) {
        setStatus({
          loading: false,
          error: "",
          message: "Registration successful! Check your email for OTP.",
        });

        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              isRegistration: true,
              type: "email_verification",
            },
          });
        }, 1000);
      } else {
        setStatus({
          loading: false,
          error: result.message || "Registration failed",
          message: "",
        });
      }
    } catch {
      setStatus({
        loading: false,
        error: "Something went wrong. Try again.",
        message: "",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">

        <div className="text-center space-y-1">
          <h2 className="text-3xl font-semibold">Sign Up</h2>
          <p className="text-gray-500 text-sm">Create your MediPredict account</p>
        </div>

        {status.message && (
          <div className="bg-green-100 text-green-700 text-sm p-3 rounded-md">
            {status.message}
          </div>
        )}

        {status.error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-md">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ✅ ROLE SELECTOR */}
          <div className="flex gap-6 justify-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="patient"
                checked={formData.role === 'patient'}
                onChange={handleChange}
              />
              Patient
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={formData.role === 'doctor'}
                onChange={handleChange}
              />
              Doctor
            </label>
          </div>

          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="peer w-full bg-transparent border-b-2 border-gray-300 outline-none py-2 focus:border-blue-600 transition"
              />
              <label
                className="absolute left-0 top-2 text-gray-500 text-sm pointer-events-none transition-all 
                peer-focus:text-blue-600 peer-focus:-translate-y-4 peer-focus:text-xs 
                peer-valid:-translate-y-4 peer-valid:text-xs"
              >
                {field === "confirmPassword"
                  ? "Confirm Password"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {status.loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline hover:text-blue-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;