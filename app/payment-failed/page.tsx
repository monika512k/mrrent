"use client"
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import assets from 'app/assets/assets';

export default function PaymentFailed() {
  const router = useRouter();

  const handleBackToHome = () => {
    window.location.href = '/landing';
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto border-4 border-red-500 rounded-full flex items-center justify-center">
           <img src={assets.cross} alt="Error Icon" className="w-8 h-8" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-white text-4xl font-semibold mb-4">
          Payment Failed
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-base mb-2">
          Oops! Something went wrong and we couldn't complete your payment.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Don't worry - your card wasn't charged. Please try again or use a
          different payment method.
        </p>

        {/* Retry Payment Button */}
        <button
          onClick={() => router.back()}
          className="w-full bg-[#F3B753] text-black font-bold py-4 rounded-lg hover:bg-[#e3a640] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Retry Payment
        </button>

        {/* Back to Home Link */}
        <button
          onClick={handleBackToHome}
          className="flex items-center text-lg justify-center text-gray-400 hover:text-white  transition-colors duration-200 mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
}