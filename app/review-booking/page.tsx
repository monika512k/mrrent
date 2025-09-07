'use client';
import React, { useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import assets from 'app/assets/assets';
import { useRouter, useSearchParams } from 'next/navigation';
import { carBookingCalculationAPI } from 'app/services/api';

// Updated types to match your actual data structure
interface CarDetails {
  id: string | number;
  brand: string;
  model: string;
  transmission: string;
  seats: number;
  fuel_type: string;
  thumbnail_image?: string;
  discount_price_per_km?: number;
  price_per_km?: string | number;
  free_km?: number;
}

interface SearchData {
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupLocationId: string | number;
  dropoffLocationId: string | number;
}

interface BookingDetails {
  tripAmount: number;
  discount: number;
  taxAmount: number;
  totalDays: number;
  carDetails: CarDetails;
  searchData: SearchData;
}

interface APIResponse {
  status: boolean;
  data: {
    base64_url?: string;
    tripAmount?: number;
    discount?: number;
    taxAmount?: number;
    total?: number;
    [key: string]: unknown;
  };
}

// Separate component that uses useSearchParams
function ReviewBookingContent() {
  const router = useRouter();
  const [extraKms, setExtraKms] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [showAgreement, setShowAgreement] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [agreementPDF, setAgreementPDF] = useState('');
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [calculationLoading, setCalculationLoading] = useState(false);
  const [apiCalculatedData, setApiCalculatedData] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const detailsParam = searchParams.get("details");

  // Parse JSON safely
  const details = useMemo((): BookingDetails | null => {
    if (!detailsParam) return null;
    try {
      return JSON.parse(detailsParam) as BookingDetails;
    } catch {
      return null;
    }
  }, [detailsParam]);

  // API call function for calculation
  const fetchCalculation = useCallback(async (kms: number) => {
    if (!details) return;
    
    setCalculationLoading(true);
    const payload = {
      car_id: details.carDetails?.id || "",
      start_date: details.searchData?.pickupDate || "",
      end_date: details.searchData?.dropoffDate || "",
      extra_kms: kms,
      pickup_location: details.searchData?.pickupLocationId || "" // Fixed: using pickupLocationId
    };
    
    try {
      const result = await carBookingCalculationAPI({
        url: 'car/calculate-booking-amount/',
        data: payload,
      }) as APIResponse;
      
      if (result?.status && result.data) {
        setApiCalculatedData(result.data);
        setCalculatedTotal(result.data.total || 0);
      }
    } catch (error) {
      console.error('Error calculating booking:', error);
      calculateTotalLocally(kms);
    } finally {
      setCalculationLoading(false);
    }
  }, [details]);

  // Local calculation as fallback
  const calculateTotalLocally = useCallback((kms: number) => {
    if (!details) return;

    const baseFare = details.tripAmount || 0;
    const extraKmRate = details.carDetails?.discount_price_per_km || 
                       parseFloat(String(details.carDetails?.price_per_km || '0'));
    const extraKmCost = extraKmRate * kms;
    const discount = details.discount || 0;
    const taxAmount = details.taxAmount || 0;

    const total = baseFare + extraKmCost - discount + taxAmount;
    setCalculatedTotal(total);
  }, [details]);

  // Handle + button click
  const handleIncreaseKms = () => {
    const newKms = extraKms + 1;
    setExtraKms(newKms);
    fetchCalculation(newKms);
  };

  // Handle - button click
  const handleDecreaseKms = () => {
    const newKms = Math.max(0, extraKms - 1);
    setExtraKms(newKms);
    fetchCalculation(newKms);
  };

  // Initial calculation on component mount
  useEffect(() => {
    if (details) {
      fetchCalculation(0);
    }
  }, [details, fetchCalculation]);

  if (!details) {
    return (
      <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  // Use API data if available, otherwise fall back to original details
  const displayData = apiCalculatedData || details;
  const baseFare = displayData.tripAmount || details.tripAmount || 0;
  const extraKmRate = details.carDetails?.discount_price_per_km || 
                     parseFloat(String(details.carDetails?.price_per_km || '0'));
  const extraKmCost = extraKmRate * extraKms;
  const discount = displayData.discount || details.discount || 0;
  const taxAmount = displayData.taxAmount || details.taxAmount || 0;
  const totalDays = details.totalDays || 1;
  const freeKm = details.carDetails?.free_km || 0;

  // Calculate discount percentage for display
  const discountPercentage = baseFare > 0 ? Math.round((discount / baseFare) * 100) : 0;

  const handleCheckout = async () => {
    setAgreementLoading(true);
    const payload = {
      car_id: details.carDetails?.id || "",
      start_date: details.searchData?.pickupDate || "",
      end_date: details.searchData?.dropoffDate || "",
      extra_kms: extraKms,
      pickup_location: details.searchData?.pickupLocationId || "", // Fixed: using pickupLocationId
    };
    
    try {
      const result = await carBookingCalculationAPI({
        url: 'booking/booking-aggrement/',
        data: payload,
        auth: true
      }) as APIResponse;
      
      setAgreementLoading(false);
      if (result?.status && result.data.base64_url) {
        setAgreementPDF(result.data.base64_url);
        setShowAgreement(true);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setAgreementLoading(false);
    }
  };

  const handleProceed = async () => {
    const payload = {
      car_id: details.carDetails?.id || "",
      start_date: details.searchData?.pickupDate || "",
      end_date: details.searchData?.dropoffDate || "",
      extra_kms: extraKms,
      pickup_location_id: details.searchData?.pickupLocationId || "", 
      dropoff_location_id: details.searchData?.dropoffLocationId || "", 
    };
    
    if (customerName.trim()) {
      try {
        const result = await carBookingCalculationAPI({
          url: 'booking/create/',
          data: payload,
          auth: true
        }) as APIResponse;
        
        if (result?.status) {
          router.push(`/payment-success?details=${encodeURIComponent(JSON.stringify(result.data))}`);
        } else {
          router.push(`/payment-failed`);
        }
        setShowAgreement(false);
      } catch (error) {
        console.error('Error during booking creation:', error);
        router.push(`/payment-failed`);
      }
    }
  };

  return (
    <>
      {!showAgreement && (
        <div className="bg-[#121212] text-white mt-18 px-4 py-10 flex flex-col items-center">
          {/* Title */}
          <h1 className="text-[24px] lg:text-[40px] font-bold text-[#f6f6f6] text-center mb-4">Review Your Booking</h1>
          <p className="text-[#f6f6f6] text-sm lg:text-lg text-center font-medium mb-6 lg:mb-10 opacity-40">Confirm your rental details before proceeding to payment</p>

          {/* Card */}
          <div className="w-[749px] max-w-full rounded-md p-4 flex flex-col reviewCard">
            {/* Trip Dates */}
            <div className="flex flex-col lg:flex-row justify-between gap-2 lg:gap-4 border-b border-[#454545] pb-4">
              <div>
                <div className='flex items-center gap-[10px] text-sm lg:text-base text-[#F6F6F6]'>
                  <div className="font-semibold">Trip Start Date & Time:</div>
                  <div className="font-normal">{details.searchData?.pickupDate || ""}</div>
                </div>
                <div className="text-sm lg:pt-0 pt-2 font-medium text-[#F6F6F6]">{details.searchData?.pickupLocation || ""}</div>
              </div>
              <div>
                <div className='flex items-center gap-[10px] text-base text-[#F6F6F6]'>
                  <div className="font-semibold">Trip End Date & Time:</div>
                  <div className="font-normal">{details.searchData?.dropoffDate || ""}</div>
                </div>
                <div className="text-sm lg:pt-0 pt-2 font-medium text-[#F6F6F6]">{details.searchData?.dropoffLocation || ""}</div>
              </div>
            </div>

            {/* Car Info & Extra KMs */}
            <div className='lg:text-lg text-base font-semibold text-[#F6F6F6] mt-4 mb-[13px] opacity-40'>Car Details</div>
            <div className="flex flex-col lg:flex-row justify-between lg:items-center items-start gap-4 border-b border-[#454545] pb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={details?.carDetails?.thumbnail_image || assets.car1}
                  alt="Car"
                  width={68}
                  height={53}
                  className="w-[68px] h-[53px] object-cover rounded"
                />
                <div className="flex flex-col gap-2 text-[#F6F6F6]">
                  <div className="font-semibold lg:text-base text-sm">
                    {details?.carDetails?.brand} {details?.carDetails?.model}
                  </div>
                  <div className="lg:text-sm text-xs opacity-60 font-medium">
                    {details?.carDetails?.transmission} | {details?.carDetails?.seats} Seats | {details?.carDetails?.fuel_type}
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:items-center items-start gap-2">
                <span className="lg:text-base text-sm font-semibold text-[#F6F6F6]">Extra KMs</span>
                <div className="flex items-center gap-[22px]">
                  <button
                    onClick={handleDecreaseKms}
                    disabled={calculationLoading}
                    className="w-6 h-6 rounded-full bg-opacity-20 backdrop-blur-[2px] flex items-center justify-center hover:bg-[#F3B753] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-[#F6F6F6]" />
                  </button>
                  <span className="w-[53px] h-10 flex items-center justify-center rounded-[9px] border border-[#454545] bg-[#121212] text-[#F6F6F6] text-[16px] relative">
                    {extraKms}
                    {calculationLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#121212] bg-opacity-80">
                        <div className="w-4 h-4 border-2 border-[#F3B753] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </span>
                  <button
                    onClick={handleIncreaseKms}
                    disabled={calculationLoading}
                    className="w-6 h-6 rounded-full bg-opacity-20 backdrop-blur-[2px] flex items-center justify-center hover:bg-[#F3B753] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-[#F6F6F6]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col lg:gap-2 gap-1 border-b border-[#454545] py-4">
              <div className="text-[#F6F6F6] lg:text-[18px] text-[16px] font-semibold opacity-40 lg:pb-2 pb-[10.5px] flex items-center gap-2">
                Price Breakdown
                {calculationLoading && (
                  <div className="w-4 h-4 border-2 border-[#F3B753] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {/* Base Fare */}
              <div className="flex justify-between text-sm text-[#F6F6F6] font-medium">
                <span>Base Fare ({totalDays} Day{totalDays > 1 ? 's' : ''}, {freeKm} KMs):</span>
                <span>€{baseFare.toFixed(2)}</span>
              </div>

              {/* Extra KMs - only show if extraKms > 0 */}
              <div className="flex justify-between text-sm text-[#F6F6F6] font-medium">
                <span>Extra KMs ({extraKms} Kms @ €{extraKmRate.toFixed(2)}/km)</span>
                <span>€{extraKmCost.toFixed(2)}</span>
              </div>

              {/* Discount - only show if discount > 0 */}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-[#34C759] font-normal">
                  <span>Discount {discountPercentage > 0 ? `(${discountPercentage}%)` : ''}</span>
                  <span className="flex items-center gap-[4px]">- <span>€{discount.toFixed(2)}</span></span>
                </div>
              )}

              {/* Taxes */}
              <div className="flex justify-between text-sm text-[#F6F6F6] font-medium">
                <span>Taxes:</span>
                <span>€{taxAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-[#F6F6F6] text-[16px] font-semibold">Total</span>
              <span className="text-[#F6F6F6] text-[16px] font-bold">€{calculatedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={calculationLoading}
            className="w-full lg:max-w-[540px] max-w-[320px] h-[57.6px] bg-[#F3B753] text-black font-bold lg:text-xl text-lg rounded-lg lg:mt-10 mt-6 lg:mb-14 mb-8 hover:bg-[#e3a640] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {agreementLoading ? "Checking out..." : calculationLoading ? "Calculating..." : "Checkout"}
          </button>

          {/* Back Button */}
          <button className="flex items-center gap-2 text-[#F6F6F6] hover:text-[#F3B753] transition lg:text-base text-sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
            Back to Previous step
          </button>
        </div>
      )}

      {showAgreement && (
        <div className="bg-black backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="mx-4 relative shadow-2xl transform transition-all duration-300 scale-100 mt-3">
            {/* Modal Content */}
            <div className="p-8 text-center mt-5">
              {/* Title */}
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 mt-5">Sign Rental Agreement</h2>
              <p className="text-[#F6F6F6] opacity-70 mb-8 text-sm leading-relaxed">
                Review and accept the rental terms to complete your booking and get ready to hit the road.
              </p>

              {/* PDF Preview Area */}
              <div className="bg-white h-90 mb-6 flex flex-col items-center justify-center relative overflow-auto border-2 border-gray-200">
                <iframe
                  src={`${agreementPDF}#toolbar=0&navpanes=0&scrollbar=0`}
                  width="100%"
                  height="600px"
                  title="Agreement PDF"
                />
              </div>

              {/* Name Input */}
              <div className="mb-8 text-left flex justify-end relative left-20">
                <div>
                  <label className="block text-[#F6F6F6] text-sm font-medium mb-3">
                    Enter Name to accept the document
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="px-4 py-3 bg-[#1E1E1E] border border-[#454545] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3B753] focus:ring-1 focus:ring-[#F3B753] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={!customerName.trim()}
                className="w-full bg-[#F3B753] text-black font-bold py-4 rounded-lg hover:bg-[#e3a640] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Proceed
              </button>

              {/* Back to Previous Step */}
              <button
                onClick={() => setShowAgreement(false)}
                className="flex items-center gap-2 text-[#F6F6F6] hover:text-[#F3B753] transition-all duration-200 text-sm mx-auto group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Previous step
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="bg-[#121212] text-white min-h-screen flex items-center justify-center">
      <p>Loading booking details...</p>
    </div>
  );
}

// Main component wrapped with Suspense
export default function ReviewBooking() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReviewBookingContent />
    </Suspense>
  );
}