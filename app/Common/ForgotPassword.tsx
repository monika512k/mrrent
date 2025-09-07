"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { resendOtp } from "app/services/api";
import { ToastMsg } from "./Toast";

interface ForgotPasswordProps {
  setCodeVerification: (value: boolean) => void;
  setForgotPsw: (value: boolean) => void;
  setResetPswMail: (value: string) => void;
  resetPswMail?: string; // Optional prop to store email for password reset
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  setCodeVerification,
  setForgotPsw,
  setResetPswMail,
  resetPswMail
}) => {
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (resetPswMail: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetPswMail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(resetPswMail || "")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const result = await resendOtp({
        email: resetPswMail || "",
        verify_type: "3"
      });
      type ResendOtpResponse = { status: boolean; message: string };
      const typedResult = result as ResendOtpResponse;
      if (typeof result === "object" && result !== null && "status" in result && typedResult.status) {
        setCodeVerification(true);
        ToastMsg(typedResult.message, "success");
        setForgotPsw(false);
      }
    } catch {
      setError("Failed to send reset link. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex justify-start items-center bg-black">
      <div className="bg-[#1A1A1A] p-8 rounded-2xl w-[400px] shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <Image src='/images/lock.png' alt="mail" width={117} height={117} />
          </div>
          <h2 className="text-white text-2xl font-semibold">Forgot Password?</h2>
          <p className="text-gray-400 text-sm mt-2">
            Please enter the email address associated with your account and we will email you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={resetPswMail}
            onChange={(e) => {
              setResetPswMail(e.target.value);
              setError("");
            }}
            className="w-full px-3 py-2 bg-transparent text-white border border-gray-600 rounded-md text-sm"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-md"
          >
            Send Request
          </button>

          <p
            className="text-sm text-gray-400 text-center mt-3 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            &larr; Back to login in
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
