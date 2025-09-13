"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OTPInput, OTPInputContext } from 'input-otp';
import { otpVerify, resendOtp } from "../services/api";
import { ToastMsg } from "./Toast";

interface OtpVerificationProps {
  email: string;
}

const OtpVerification = ({ email }: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await otpVerify({
        email: email, 
        otp: otp, 
        verify_type: "2"
      }) as { status: boolean };
      
      if (result.status) {
        ToastMsg("Verified successfully", "success");
        localStorage.setItem('user_loggedin', 'true');
        window.location.href = '/landing';

      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const result = await resendOtp({
        email: email,
        verify_type: "2"
      }) as { status: boolean };
      if (result.status) {
        setError("");
        setOtp(""); // Clear the OTP input
        ToastMsg("OTP resent successfully", "success");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    window.location.href = '/signin';
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
    <div className="min-h-screen flex justify-center items-center bg-black">
     <div className="bg-[#1A1A1A] p-8 rounded-2xl w-[400px] shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <Image src='/images/mail.png' alt="mail" width={117} height={117} />
          </div>
          <h2 className="text-white text-xl font-semibold">Request sent successfully!</h2>
          <p className="text-gray-400 text-sm mt-2">
            We have sent a 6-digit confirmation code to your email.
            Please enter the code in the box below to verify your email.
          </p>
          <input
            value={email}
            readOnly
            disabled
            className="w-full mt-4 px-3 py-2 bg-transparent text-sm text-white border border-gray-600 rounded-md"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3 text-center">
              Enter 6-digit code
            </label>
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
                    {({ slots }) => (
                      <>
                        {slots.length>0&&slots.map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </>
                    )}
                  </OTPInputContext.Consumer>
                )}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400">
              Don't have a code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="text-yellow-500 hover:text-yellow-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </p>

            <button
              type="button"
              onClick={handleBackToSignIn}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;