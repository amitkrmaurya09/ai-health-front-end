import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const type = location.state?.type || "";

  useEffect(() => {
    if (!email || !type) navigate("/login");
  }, [email, type, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return setError("Please enter all 6 digits");
    }

    setLoading(true);
    setError("");

    try {
      const result = await api.auth.verifyOTP({ email, otp: otpValue, type });

      if (result.success) {
        if (type === "reset_password") {
          navigate("/reset-password", { state: { email, otp: otpValue } });
        } else {
          navigate("/login", {
            state: { message: "Email verified successfully! Please log in." },
          });
        }
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const result =
        type === "reset_password"
          ? await api.auth.forgotPassword({ email })
          : await api.auth.resendVerificationEmail({ email });

      if (result.success) setTimeLeft(60);
      else setError(result.message || "Failed to resend OTP");
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Verify OTP</h2>
          <p className="text-gray-500 text-sm">
            A 6-digit code has been sent to<br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 text-center text-xl border-b-2 border-gray-400 outline-none 
                focus:border-blue-600 transition bg-transparent"
              />
            ))}
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center space-y-3">
          {timeLeft > 0 ? (
            <p className="text-gray-600 text-sm">
              Resend code in{" "}
              <span className="text-blue-600 font-semibold">{timeLeft}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-blue-600 hover:underline text-sm"
            >
              Resend Code
            </button>
          )}

          <Link
            to="/login"
            className="block text-blue-600 hover:underline text-sm mt-2"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
