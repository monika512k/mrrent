"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { OTPInput, OTPInputContext } from 'input-otp';
import Image from "next/image";
import { otpVerify, resendOtp, resetPassword } from "app/services/api";
import { ToastMsg } from "./Toast";

interface PasswordResetConfirmationProps {
  resetPswMail: string;
}

const PasswordResetConfirmation = ({ resetPswMail }: PasswordResetConfirmationProps) => {
  const [otp, setOtp] = useState(""); // Single OTP state for the complete code
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async () => {
    // Validation checks
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First verify OTP
      const otpResult = await otpVerify({
        email: resetPswMail, // Use the prop instead of undefined 'email'
        otp: otp, 
        verify_type: "3"
      }) as { status: boolean };
      
      console.log("Result from otpVerify:", otpResult);

      if (otpResult.status) {
        // If OTP is valid, reset password
        const resetResult = await resetPassword({
          email: resetPswMail,
          new_password: newPassword,
          confirm_password: confirmPassword
        }) as { status: boolean };
        if( resetResult?.status) {
          ToastMsg("Password updated successfully", "success");
          window.location.href = '/login';
        }
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(""); // Clear error when user types
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      const result = await resendOtp({
        email: resetPswMail,
        verify_type: "3"
      });
      console.log("Resend OTP result:", result);
      // You might want to show a success message here
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Custom Slot component for styling individual inputs
  function Slot(props: React.ComponentPropsWithoutRef<'div'> & { 
    char?: string | null; 
    hasFakeCaret?: boolean; 
    isActive?: boolean;
  }) {
    return (
      <div
        className={`relative w-12 h-12 text-lg font-medium text-center border rounded-lg flex items-center justify-center transition-all duration-200 ${
          props.isActive 
            ? 'border-yellow-500 ring-2 ring-yellow-500/20' 
            : error 
              ? 'border-red-500' 
              : 'border-gray-600'
        } bg-transparent text-white`}
        {...props}
      >
        {props.char}
        {props.hasFakeCaret && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-6 bg-yellow-500 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-black px-4">
      <div className="bg-[#1A1A1A] p-8 rounded-2xl w-full max-w-[450px] shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
             <Image src='/images/mail.png' alt="mail" width={117} height={117} />
            </div>
          </div>
          <h2 className="text-white text-2xl font-semibold mb-2">Request sent successfully!</h2>
          <p className="text-gray-400 text-sm">
            We've sent a 6-digit confirmation code to your email.
          </p>
          <p className="text-gray-400 text-sm">
            Please enter the code in the box below to verify your email.
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Display */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <div className="w-full px-3 py-3 bg-transparent text-white border border-gray-600 rounded-md text-sm">
             {resetPswMail}
            </div>
          </div>

          {/* 6-Digit Code Input */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Verification Code</label>
            <div className="flex justify-center">
              <OTPInput
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                autoFocus
                pushPasswordManagerStrategy="increase-width"
                containerClassName="flex gap-3"
                render={({ slots }) => (
                  <OTPInputContext.Consumer>
                    {({ slots: contextSlots }) => (
                      <>
                        {slots?.length>0&&slots.map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </>
                    )}
                  </OTPInputContext.Consumer>
                )}
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <div className="relative">
              <label className="absolute left-3 top-[-12px] bg-[#1A1A1A] px-1 text-gray-400 text-sm font-medium pointer-events-none z-10">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="8+ characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-3 py-3 bg-transparent text-white border border-gray-600 rounded-md text-sm pr-10 focus:border-yellow-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
               <label className="absolute left-3 top-[-12px] px-1 bg-[#1A1A1A] text-gray-400 text-sm font-medium pointer-events-none z-10">
                 Confirm Password
               </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="8+ characters"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-3 py-3 bg-transparent text-white border border-gray-600 rounded-md text-sm pr-10 focus:border-yellow-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={isLoading}
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>

          <div className="text-center">
            <span className="text-gray-400 text-sm">Don't have a code? </span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-yellow-500 text-sm hover:underline disabled:opacity-50"
            >
              Resend Code
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirmation;