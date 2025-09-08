'use client'
import React, { useEffect, useState } from 'react';
import assets from 'app/assets/assets';
import SearchForm from 'app/Common/SearchForm';
import { carBookingCalculationAPI, carDetail, getDiscount, licenceStatus } from 'app/services/api'; // Added getLocations import
import { useParams } from 'next/navigation';
import { useCarSearch } from 'app/hooks/CarSearch';
import { useRouter } from 'next/navigation';
import { ToastMsg } from 'app/Common/Toast';
import ReusablePopup from 'app/components/popup';
import { useLanguage } from 'app/context/LanguageContext';
interface CarData {
  body_type: string;
  brand: string;
  car_type: string;
  car_type_list: string[];
  color: string;
  discount_price_per_day: number;
  discount_price_per_km: number;
  extra_km: number;
  feature_list: string[];
  free_km: number;
  fuel_type: string;
  id: number;
  image_list: string[];
  model: string;
  price_per_day: string;
  price_per_km: string;
  seats: number;
  thumbnail_image: string;
  transmission: string;
  year: number;
  current_location: number;
}

interface CalculationData {
  total_days: number;
  extra_kms: number;
  total_days_amount: number;
  extra_km_amount: number;
  total_amount: number;
  discount_type: string;
  discount_value: number;
  total_discount: number;
  total_amount_after_discount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount_with_tax: number;
  round_up: number;
  price_per_day: number;
  price_per_km: number;
}


const CheckIcon = () => (
  <span
    className="flex justify-center items-center w-4 h-4 rounded-full"
    style={{
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(1.33px)",
    }}
  >
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
      <path
        d="M1 3.5L3 5L7 1"
        stroke="#F6F6F6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const CarDescription = () => {
  const router = useRouter();
   const { t } = useLanguage();
  const { language  } = useLanguage();
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountDescription, setDiscountDescription] = useState("");
  const {
    locations,
    searchData,
    handleSearch,
  } = useCarSearch({
    pageSize: 20,
    debounceMs: 0,
    autoFetchLocations: true,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [extraKms, setExtraKms] = useState(0);
  const [carData, setCarData] = useState<CarData | null>(null);
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculationLoading, setCalculationLoading] = useState(false);


 


  const getCarDetails = async () => {
    try {
      setLoading(true);
      const result = await carDetail(String(id),String(language)) as any;
    

      if (result && result.data) {
        setCarData(result.data);
        const existingSearchDataString =
          typeof window !== "undefined" ? localStorage.getItem("searchData") : null;

        const existingSearchData = existingSearchDataString
          ? JSON.parse(existingSearchDataString)
          : null;

        if (
          !existingSearchData ||
          !existingSearchData.pickupLocationId ||
          !existingSearchData.pickupLocation
        ) {

          const currentLocation = locations.find(
            (loc) => loc.id === result.data.current_location
          );

          const newSearchData = {
            pickupLocationId: currentLocation?.id || null,
            pickupLocation: currentLocation?.address || "",
            dropoffDate: null,
            dropoffLocationId: null,
          };

          localStorage.setItem("searchData", JSON.stringify(newSearchData));
        }

      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    } finally {
      setLoading(false);
    }
  };


  const calculateBookingAmount = async (extrakm?:number) => {
   
    if(extrakm !== undefined && extrakm !== null){
      setExtraKms(extrakm)
    }
    if (!carData || !searchData?.pickupDate || !searchData?.dropoffDate) {
      console.log('Missing data for calculation:', { carData: !!carData, searchData });
      return;
    }

    try {
      setCalculationLoading(true);
      const calculationPayload = {
        car_id: carData.id,
        extra_kms: extrakm ?? extraKms,
        pickup_location: searchData.pickupLocationId || 'Default Location',
        start_date: searchData.pickupDate,
        end_date: searchData.dropoffDate,
      };

      console.log('Calculation payload:', calculationPayload);

      const result = await carBookingCalculationAPI({
        url: 'car/calculate-booking-amount/',
        data: calculationPayload
      }) as any;

      console.log('Calculation result:', result);
      if (result && result.data) {
        setCalculationData(result.data);
      }
    } catch (error: any) {
      console.error('Error during car booking calculation:', error);
      if (!error.response.data.status && error.response.data.data == "not_available") {
        setShow(true)
      } else {
        ToastMsg(error.response.data.message, "error");
      }
    } finally {
      setCalculationLoading(false);
    }
  };

  // Handle extra km changes
  const handleExtraKmChange = (newExtraKms: number) => {
    setExtraKms(newExtraKms);
  };

  // Separate function to proceed with booking (without checking discount again)
  const proceedWithBooking = async () => {
   
    setShowDiscount(false);
    setDiscountDescription("");


    if (!searchData || !searchData?.pickupDate || !searchData?.dropoffDate || !searchData?.pickupLocation || !searchData?.dropoffLocation) {
      ToastMsg("Missing ( pickupDate, dropoffDate, pickupLocation, dropoffLocation )", "error")
      return;
    }

    let data = {
      vehical_name: carData!.brand + " " + carData!.model,
      start_date: searchData?.pickupDate || "",
      end_date: searchData?.dropoffDate || "",
      total_amount: totalPrice.toFixed(2)
    };

    let reviewData = {
      carDetails: carData,
      tripAmount, extraKmPrice, discount, totalPrice, taxAmount, totalDays,
      searchData,
    }
  

    const result = await licenceStatus() as any;
    if (result?.data?.status === "no_license_found" && result?.data?.status != "Approved" && data) {
      router.push(`/upload-documents?details=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/review-booking?details=${encodeURIComponent(JSON.stringify(reviewData))}`);
    }
  }

  useEffect(() => {
    getDiscount(id).then((res)=>{
 
      if (!!res && res?.data?.offer !== "") {
        setShowDiscount(true);
        setDiscountDescription(res?.data?.offer);
      }
      else {
        setShowDiscount(false)
      }

    }).catch((err)=>{
      console.log(err)
    })
    
  
  
      
  }, []);

  const onBooking = async () => {
    if (!localStorage.getItem("token")) {
      
      router.push("/login")
      return;
    }
   
      await proceedWithBooking();
    
  }

  useEffect(() => {
    if (id) {
      getCarDetails();
    }
  }, [id, locations]);

  useEffect(() => {
    if (carData && searchData && searchData.pickupDate && searchData.dropoffDate) {
      calculateBookingAmount();
    }
  }, [carData, searchData, extraKms]);

  if (loading) {
    return (
      <div className="bg-[#121212] min-h-screen text-white px-6 pt-6 md:px-24 mt-12 pb-10 flex items-center justify-center">
        <div className="text-[#F3B753] text-xl">Loading car details...</div>
      </div>
    );
  }

  // Show error state if no car data
  if (!carData) {
    return (
      <div className="bg-[#121212] min-h-screen text-white px-6 pt-6 md:px-24 mt-12 pb-10 flex items-center justify-center">
        <div className="text-red-500 text-xl">Car details not found</div>
      </div>
    );
  }

  // Calculate display values - use API data if available, fallback to local calculation
  const getDisplayPricing = () => {
    if (calculationData) {
      return {
        tripAmount: calculationData.total_days_amount,
        extraKmPrice: calculationData.extra_km_amount,
        discount: calculationData.total_discount,
        totalPrice: calculationData.total_amount_with_tax,
        taxAmount: calculationData.tax_amount,
        totalDays: calculationData.total_days,
      };
    }

    // Fallback to basic calculation if no API data
    const tripAmount = carData.discount_price_per_day || parseFloat(carData.price_per_day);
    const extraKmPrice = extraKms * (carData.discount_price_per_km || parseFloat(carData.price_per_km));
    const subtotal = tripAmount + extraKmPrice;
    const discount = subtotal * 0.1; // 10% discount as fallback
    const totalPrice = subtotal - discount;

    return {
      tripAmount,
      extraKmPrice,
      discount,
      totalPrice,
      taxAmount: 0,
      totalDays: 1
    };
  };

  const { tripAmount, extraKmPrice, discount, totalPrice, taxAmount, totalDays } = getDisplayPricing();

  return (
    <>
      <div className="bg-[#121212] min-h-screen text-white px-6 pt-6 md:px-24 mt-12 pb-10">
        {
          <SearchForm
            current_location={carData?.current_location }
            onSubmitOverride={handleSearch}
            locationList={locations as any}
            title={"Update"}
            src="car_description"
          />
        }

        {/* Back Button */}
        <button className="flex items-center gap-2 text-[#F3B753] font-medium mb-4 mt-6">
          <span className="text-xl">←</span> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Image and Thumbnails */}
          <div className="md:col-span-8">
            <div className="flex gap-4">
              {/* Main Image */}
              <div className="flex-1 rounded-[8px] overflow-hidden">
                <img src={carData?.thumbnail_image} alt={`${carData.brand} ${carData.model}`} className="w-[724px] h-[357px] object-cover" />
              </div>
             
              <div className="flex flex-col gap-[17.8px]">
                {carData?.image_list.map((img, idx) => (
                  <img
                    key={img + idx}
                    src={img}
                    alt={`${carData.brand} ${carData.model} thumbnail`}
                    className={`w-[184px] h-[107px] object-cover rounded-[8px] cursor-pointer ${selectedImage === idx ? 'border-2 border-[#F3B753]' : ''
                      }`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trip Summary Card */}
          <div className="md:col-span-4">
            <div className="border border-[#F6e19b] rounded-lg p-4 flex flex-col justify-center items-center 
                  bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] 
                  backdrop-blur-[18.6px] ">

              {calculationLoading && (
                <div className="text-[#F3B753] text-sm mb-2">Updating pricing...</div>
              )}

              <div className="flex flex-col gap-4 text-sm w-full text-[#F6F6F6]">
                <div className="flex justify-between text-[#F6F6F6]">
                  <span>Trip amount ({totalDays} day{totalDays > 1 ? 's' : ''})</span>
                  <span>€ {tripAmount.toFixed(2)}</span>
                </div>
                {extraKms > 0 && (
                  <div className="flex justify-between">
                    <span>Extra Kms ({extraKms} Kms)</span>
                    <span>€ {extraKmPrice.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-[#34C759]">
                    <span>Discount</span>
                    <span>- € {discount.toFixed(2)}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({calculationData?.tax_rate || 0}%)</span>
                    <span>€ {taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-2 border-[#232323]" />
              </div>
              <div className='flex flex-col w-full mb-8'>
                <div className="flex justify-between font-semibold text-base">
                  <span>Total price</span>
                  <span>€ {totalPrice.toFixed(2)}</span>
                </div>
                <span className="text-xs text-white/60 mt-[4px]">(incl. of all taxes)</span>
              </div>
              <button className="w-full bg-[#F3B753] text-black py-3 rounded-lg font-semibold hover:bg-[#e3a640] transition cursor-pointer" onClick={() => {
                onBooking();
              }}>
              {t('common.bookNow')}
              </button>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="mt-6 max-w-[924px]">
          <div className="flex flex-col gap-2 mb-2">
            <span className="text-sm text-[#F6F6F6]/60">Hosted by: <span className="text-[#F6F6F6]">Fredrick Thomas</span></span>
            <div className='flex justify-between item-center'>
              <div className='flex flex-col'>
                <span className="text-2xl font-semibold">{carData.brand} {carData.model}</span>
                <span className="text-sm text-[#F6F6F6]/80">
                  {carData.transmission} • {carData.fuel_type} • {carData.seats} seater • {carData.free_km} KMs • {carData.year}
                </span>
              </div>
              <span className="text-[32px] font-bold text-[#F6f6f6]">
                € {(carData.discount_price_per_day || parseFloat(carData.price_per_day)).toFixed(2)}
                <span className="text-sm font-bold text-[#F6F6F6]">/day</span>
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="my-8 border border-[#F6e19b] rounded-lg p-4 flex flex-col 
                  bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] 
                  backdrop-blur-[18.6px] max-w-[924px]">
          <div className="font-semibold text-base mb-4 font-['Poppins']">FEATURES</div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {carData.feature_list.map((feature, idx) => (
              <React.Fragment key={feature}>
                <div className="flex flex-wrap items-center gap-2">
                  <CheckIcon />
                  <span className="font-poppins font-normal text-[#F6F6F6] text-[14px] leading-[21px]">{feature}</span>
                </div>
                {idx !== carData.feature_list.length - 1 && (
                  <span
                    className="h-5 border-l border-[#F6F6F6] opacity-20 mx-2"
                    style={{ width: "0.75px" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Extra KM Selector */}
        <div className="border border-[#F6e19b] rounded-lg p-4 mb-8 flex flex-col 
                bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] 
                backdrop-blur-[18.6px] max-w-[924px]">
          <div className="font-['Poppins'] font-semibold text-base text-[#F6F6F6] mb-2">
            Need Km beyond {carData.free_km} KMs?<br />
            <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">
              Add Extra Km @ € {(carData.discount_price_per_km || parseFloat(carData.price_per_km)).toFixed(2)}/Km
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-[22px]">
              <button
                onClick={() => calculateBookingAmount(Math.max(0, extraKms - 1))}
                className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.2)] border border-[#F6F6F6]/20 flex items-center justify-center font-bold text-[20px] text-[#F6F6F6] transition hover:bg-[#F3B753] hover:text-black"
              >-</button>
              <input
                type="number"
                min={0}
                value={extraKms}
                onChange={e => calculateBookingAmount(Math.max(0, Number(e.target.value)))}
                className="w-[53px] h-[40px] bg-[#121212] border border-[#454545] rounded-[9px] px-4 py-2
             font-['Poppins'] font-normal text-base leading-6 text-[#F6F6F6] text-center outline-none"
              />
              <button
                onClick={() => calculateBookingAmount(extraKms + 1)}
                className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.2)] border border-[#F6F6F6]/20 flex items-center justify-center font-bold text-[20px] text-[#F6F6F6] transition hover:bg-[#F3B753] hover:text-black"
              >+</button>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
       {showDiscount&& <div
          className="max-w-[924px] h-[132px] rounded-[10px] flex items-center px-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(153, 153, 153, 0) 0%, rgba(255, 255, 255, 0.2) 111.34%)"
          }}
        >
          {/* Ellipse 5 (top-right) */}
          <img
            src={assets.Ellipse5}
            alt="Ellipse 5"
            className="absolute top-[105px] left-[540px] w-[38px] h-[38px] pointer-events-none"
            style={{ zIndex: 1 }}
          />

          {/* Ellipse 4 (bottom-left) */}
          <img
            src={assets.Ellipse4}
            alt="Ellipse 4"
            className="absolute top-[-22px] left-[653px] w-[58.12px] h-[58.12px] pointer-events-none"
            style={{ zIndex: 1 }}
          />

          {/* Text Section (left) */}
          <div className="flex-1 z-10">
            <span className="font-['Poppins'] font-semibold text-2xl text-[#ffffff]">
              Longer Trips, <span className="underline decoration-[#F3B753]">Bigger Savings!</span>
            </span>
            <p className="font-['Poppins'] text-lg font-semibold mt-1 text-gray-400">
              Rent a car for 3 days and <span className="text-[#ffffff] font-semibold">save 10%</span> – Go 7+ days and <span className="text-[#ffffff] font-semibold">save 20%!</span>
            </p>
          </div>

          {/* Car Image (right) */}
          <div className="z-10 flex items-center">
            <img src={assets.tempImageCar} alt="Promo Car" className="w-[256px] h-[132px] absolute left-[668px] object-contain" />
          </div>
        </div>}
      </div>

      {show && (
        <ReusablePopup
          isOpen={show}
          onClose={() => setShow(false)}
          title="Oops!"
          subtitle="This Car Was Just Booked"
          description="This car has just been reserved. But don't worry, we've got plenty of great options waiting for you.\n\nYou can either browse similar cars or update your search."
          icon={assets.vector}
          buttons={[
            {
              label: "Cancel",
              variant: "secondary",
              onClick: () => setShow(false)
            },
            {
              label: "Explore Other Cars",
              variant: "primary",
              onClick: () => {
                router.push('/car-listing');
                setShow(false);
              }
            }
          ]}
        />
      )}

      {showDiscount && (
        <ReusablePopup
          isOpen={showDiscount}
          onClose={() => setShowDiscount(false)}
          title="Great News!"
          subtitle="You've Got a Discount!"
          description={discountDescription}
          icon={assets.carImage}
          buttons={[{
            label: "Continue to Claim Discount",
            variant: "primary",
            onClick: () => proceedWithBooking() // Now calls the separate function
          }]}
        />
      )}

    </>

  );
};

export default CarDescription;