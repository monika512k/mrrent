"use client"
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../context/LanguageContext';

import { useParams, usePathname, useRouter } from 'next/navigation';
import path from 'path';
import { ToastMsg } from './Toast';


const SearchForm = ({ onSubmitOverride, locationList = [], title = "Search", src = "", current_location = "" }) => {
  const { t } = useLanguage();
  const pickupDateRef = useRef(null);
  const dropoffDateRef = useRef(null);
  const pathname = usePathname()

  let currentSearchData = {};

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("searchData");
    currentSearchData = stored ? JSON.parse(stored) : {};
  }
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    clearErrors,
  } = useForm({
    defaultValues: {
      pickupDate: currentSearchData?.pickupDate || new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16),
      dropoffDate: currentSearchData?.dropoffDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      pickupLocation:  currentSearchData?.pickupLocation ||  '',
      dropoffLocation:  currentSearchData?.dropoffLocation || '',
    },
  });
  const router = useRouter();

  // State for location IDs
  
  const [selectedPickupLocationId, setSelectedPickupLocationId] = useState(src==="car_description"?current_location :(pathname==="/landing"||pathname==="/")?'':currentSearchData&&currentSearchData?.pickupLocationId || '');
  const [selectedDropoffLocationId, setSelectedDropoffLocationId] = useState(src==="car_description"?current_location: (pathname==="/landing"||pathname==="/")?'':currentSearchData&&currentSearchData?.dropoffLocationId || '');

  // Filter locations based on type
  const pickupLocations = locationList.filter(
    (location) => location.is_pickup_location && location.is_active
  );
  const dropoffLocations = locationList.filter(
    (location) => location.is_drop_location && location.is_active
  );

  useEffect(() => {
    if (currentSearchData?.pickupLocationId && currentSearchData?.pickupLocation) {
      setValue('pickupLocation', currentSearchData?.pickupLocation);
     
    }
  }, [ setValue,currentSearchData?.pickupLocationId]);

  const handleDateChange = (e, type) => {
    const value = e.target.value;
    setValue(type === 'pickup' ? 'pickupDate' : 'dropoffDate', value, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
    
    setTimeout(() => {
      e.target.blur();
    }, 100);
  };

  const handlePickupLocationSelect = (e) => {
    const selectedId = parseInt(e.target.value); 
    
    if (selectedId) {
      const selectedLocation = pickupLocations.find((loc) => loc.id === selectedId);
      
      if (selectedLocation) {
        setValue('pickupLocation', selectedLocation.address, { 
          shouldValidate: true,
          shouldDirty: true 
        });
        setSelectedPickupLocationId(selectedLocation.id);
        clearErrors('pickupLocation');
      }
    } else {
      setValue('pickupLocation', '', { shouldValidate: true, shouldDirty: true });
      setSelectedPickupLocationId(null);
    }
  };

  // Handle dropoff location selection
  const handleDropoffLocationSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    
    if (selectedId) {
      const selectedLocation = dropoffLocations.find((loc) => loc.id === selectedId);
      
      if (selectedLocation) {
        setValue('dropoffLocation', selectedLocation.address, { 
          shouldValidate: true,
          shouldDirty: true 
        });
        setSelectedDropoffLocationId(selectedLocation.id);
        clearErrors('dropoffLocation');
      }
    } else {
      setValue('dropoffLocation', '', { shouldValidate: true, shouldDirty: true });
      setSelectedDropoffLocationId(null);
    }
  };

  // Handle form submission
  const onSubmit = (data) => {

     if(!selectedPickupLocationId){
      return ToastMsg(t('hero.form.pickupLocation.error'))
     }
     if(!selectedDropoffLocationId){
     return ToastMsg(t('hero.form.dropoffLocation.error'))
     }
    if(src==="landing"||src===""){
      router.push("/car-listing")
    }

    const formData = {
      ...data,
      pickupLocationId: selectedPickupLocationId || undefined,
      dropoffLocationId: selectedDropoffLocationId || undefined,
    };

    console.log('Form Data with Location IDs:', formData);
    if (onSubmitOverride) {
      onSubmitOverride(formData);
    } else {
      alert('Finding vehicles with your preferences! Check console for data.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center pt-10 px-0 sm:px-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row items-end gap-6 w-full max-w-[1268px] bg-[#121212] rounded-2xl shadow-lg"
      >
        <div className="grid grid-cols-1 md:flex md:flex-row items-end gap-4 w-full">
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:flex md:items-end">
            {/* Pick-up Location */}
            <div className="flex flex-col gap-2.5 w-full relative">
              <label
                htmlFor="pickupLocation"
                className="text-[#F6F6F6] lg:text-base text-xs font-semibold opacity-80"
              >
                {t('hero.form.pickupLocation.label')}
              </label>
              <div className="bg-white cursor-pointer border border-black/10 rounded-lg lg:p-4 p-3 flex items-center gap-3 relative">
                <MapPin className="w-5 h-5 text-[#454545]" />
                <select
                  id="pickupLocationSelect"
                  className="bg-transparent  pr-[5px] truncate outline-none text-[#454545] text-sm font-normal lg:w-[190px] w-full cursor-pointer appearance-none"
                  onChange={handlePickupLocationSelect}
                  value={selectedPickupLocationId || ''}
                >
                  <option value=''>{t('hero.form.pickupLocation.placeholder')}</option>
                  {pickupLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.address}
                    </option>
                  ))}
                </select>
                <input
                  type="hidden"
                  {...register('pickupLocation', { required: t('hero.form.pickupLocation.error') })}
                />
                <div className="absolute right-3">
                  <svg
                    className="w-4 h-4 text-[#454545]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm">{errors.pickupLocation.message}</p>
              )}
            </div>

            {/* Pick-up Date */}
            <div className="flex flex-col gap-2.5 w-full" ref={pickupDateRef}>
              <label
                htmlFor="pickupDate"
                className="text-[#F6F6F6] lg:text-base text-xs font-semibold opacity-80"
              >
                {t('hero.form.pickupDate.label')}
              </label>
              <div className="bg-white border border-black/10 rounded-lg p-4 flex items-center gap-3 relative">
                <Calendar className="w-5 h-5 text-[#454545] pointer-events-none z-10" />
                <input
                  type="datetime-local"
                  id="pickupDate"
                  className="bg-transparent outline-none text-[#454545] text-sm font-normal w-full cursor-pointer"
                  {...register('pickupDate', { required: t('hero.form.pickupDate.error') })}
                  onChange={(e) => handleDateChange(e, 'pickup')}
                />
              </div>
              {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:flex md:items-end">
            {/* Drop-off Location */}
            <div className="flex flex-col gap-2.5 w-full relative">
              <label
                htmlFor="dropoffLocation"
                className="text-[#F6F6F6] lg:text-base text-xs font-semibold opacity-80"
              >
                {t('hero.form.dropoffLocation.label')}
              </label>
              <div className="bg-white border border-black/10 rounded-lg lg:p-4 p-3 flex items-center gap-3 relative">
                <MapPin className="w-5 h-5 text-[#454545]" />
                <select
                  id="dropoffLocationSelect"
                  className="bg-white pr-[5px] truncate outline-none text-[#454545] text-sm font-normal lg:w-[190px] w-full cursor-pointer appearance-none"
                  onChange={handleDropoffLocationSelect}
                  value={selectedDropoffLocationId || 'default'}
                >
                  <option value='default'>{t('hero.form.dropoffLocation.placeholder')}</option>
                  {dropoffLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.address}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="hidden"
                  {...register('dropoffLocation', { required: t('hero.form.dropoffLocation.error') })}
                /> */}
                <div className="cursor-pointer absolute right-3">
                  <svg
                    className="w-4 h-4 text-[#454545]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.dropoffLocation && (
                <p className="text-red-500 text-sm">{errors.dropoffLocation.message}</p>
              )}
            </div>

            {/* Drop-off Date */}
            <div className="flex flex-col gap-2.5 w-full" ref={dropoffDateRef}>
              <label
                htmlFor="dropoffDate"
                className="text-[#F6F6F6] lg:text-base text-xs font-semibold opacity-80"
              >
                {t('hero.form.dropoffDate.label')}
              </label>
              <div className="!bg-white border rounded-lg p-4 flex items-center gap-3 relative">
                <Calendar className="w-5 h-5 text-[#454545] pointer-events-none z-10" />
                <input
                  type="datetime-local"
                  id="dropoffDate"
                  className="bg-transparent outline-none text-[#454545] text-sm font-normal w-full cursor-pointer"
                  {...register('dropoffDate', { required: t('hero.form.dropoffDate.error') })}
                  onChange={(e) => handleDateChange(e, 'dropoff')}

                />
              </div>
              {errors.dropoffDate && (
                <p className="text-red-500 text-sm">{errors.dropoffDate.message}</p>
              )}
            </div>
          </div>

          <div className="w-full md:w-[188px]">
            <button
              type="submit"
              className="flex cursor-pointer items-center justify-center gap-2 border text-[#F3B753] border-[#F3B753] hover:text-[#121212] hover:bg-[#F3B753] font-semibold text-sm rounded-lg lg:px-6 px-4 lg:py-4 py-3 w-full"
             
            >
              {title || t('hero.form.submitButton')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;