import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, isRegistration } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate(isRegistration ? "/register" : "/forgot-password");
    }
  }, [email, isRegistration, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) return setError("Please enter all 6 digits.");

    setLoading(true);
    setError("");

    try {
      const result = await api.auth.verifyOTP({ email, otp: otpValue });

      if (result.success && (result.data?.verified || result.verified)) {
        setIsVerified(true);

        setTimeout(() => {
          navigate(isRegistration ? "/login" : "/reset-password", {
            state: { email, otp: otpValue },
          });
        }, 1500);
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

    try {
      const result = await api.auth.forgotPassword({ email });
      if (result.success) {
        setTimeLeft(60);
      } else {
        setError(result.message || "Failed to resend code.");
      }
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  // Success UI
  if (isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4 w-full max-w-md">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-full mx-auto">
            <span className="text-3xl text-green-600">✔</span>
          </div>
          <h2 className="text-xl font-semibold text-green-600">Email Verified!</h2>
          <p className="text-gray-600">Redirecting you shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg space-y-6">

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">
            {isRegistration ? "Verify Your Email" : "Enter OTP"}
          </h2>
          <p className="text-gray-500 text-sm">
            We sent a code to <br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 text-center text-2xl font-semibold border-b-2 border-gray-400 outline-none focus:border-blue-600 transition bg-transparent"
              />
            ))}
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center space-y-3">
          {timeLeft > 0 ? (
            <p className="text-gray-600 text-sm">
              Resend OTP in{" "}
              <span className="font-semibold text-blue-600">{timeLeft}s</span>
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

          <Link to="/login" className="block text-gray-600 hover:underline text-sm">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
