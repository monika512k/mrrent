'use client'
import React, { useState, useEffect, useRef } from "react";
import assets from "../assets/assets";
import { Users, Fuel } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Loader } from "../Common/Loader";
import { useRouter } from 'next/navigation';
import { useCarSearch } from '../hooks/CarSearch';

const CarRentalGrid = ({ searchContext }) => {
    const { language, setLoader, t } = useLanguage();
    const router = useRouter();
    
    const [activeCategory, setActiveCategory] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);
    const [categories, setCategories] = useState([]);

    // Use search context if provided, otherwise initialize own hook
    const hookData = searchContext || useCarSearch({
        pageSize: 9,
        debounceMs: 300,
        autoFetchLocations: false,
    });

    const {
        cars: filteredCars,
        locations,
        searchData,
        filters,
        loading,
        updateFilters,
        setFilters,
        handleSearch,
    } = hookData;

    // Fetch car types (categories)
    const handlecarsTypes = async () => {
        try {
            setLoader(true);
            const { getCarsTypes } = await import("../services/api");
            const cars = await getCarsTypes({
                selected_language: language,
                used_for: 'landing'
            });
            console.log("pppp", cars.data);
            setCategories(cars?.data || []);
            setLoader(false);
        } catch (error) {
            console.error("Failed to fetch car types:", error);
            setLoader(false);
        }
    };

    // Initialize categories on language change
    useEffect(() => {
        handlecarsTypes();
    }, [language]);

    // Update filters when category changes
    useEffect(() => {
        if (activeCategory) {
            setFilters({
                ...filters,
                selectedCarTypes: [activeCategory],
                // Add any other landing page specific filters
                used_for: 'landing',
                selected_language: language,
            });
        } else {
            // Reset filters when no category is selected
            setFilters({
                used_for: 'landing',
                selected_language: language,
            });
        }
    }, [activeCategory, language]);

    const handleScroll = () => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;
        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth = scrollContainer.firstChild?.offsetWidth || 1;
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(parseFloat(price));
    };

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName === activeCategory ? "" : categoryName);
    };

    // Handle search from CarSearch component
    const handleCarSearch = (searchFormData) => {
        console.log('Search triggered from CarSearch:', searchFormData);
        
        // Convert form data to the format expected by the hook
        const searchParams = {
            pickupLocation: searchFormData.pickupLocation,
            pickupDate: searchFormData.pickupDate,
            dropoffLocation: searchFormData.dropoffLocation,
            dropoffDate: searchFormData.dropoffDate,
        };
        
        // Trigger search using the hook
        handleSearch(searchParams);
        
        // Optionally clear category filter when searching
        setActiveCategory("");
    };

    return (
        <div className="text-white py-0 lg:py-12 px-4 sm:px-4 lg:px-8">
            <div className="lg:mx-28 mx-2 text-center">
                <h2 className="lg:text-3xl font-bold text-4xl">
                    {t('carRental.title')}
                </h2>
                <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
                    {t('carRental.description')}
                </p>

                <div className="flex flex-wrap justify-center mt-6 gap-3">
                    {categories.length>0&&categories.map((label) => (
                        <button
                            key={label?.id}
                            onClick={() => handleCategoryClick(label?.name)}
                            className={`px-4 py-2 rounded-full border text-[10px] cursor-pointer transition ${
                                label.name === activeCategory
                                    ? "bg-white text-black font-semibold border-white"
                                    : "text-gray-400 border-gray-600 hover:bg-gray-800"
                            }`}
                        >
                            {label?.other_name}
                        </button>
                    ))}
                </div>

                <div className="mt-10">
                    {/* Show loading indicator */}
                    {loading && (
                        <div className="flex justify-center items-center h-32">
                            <Loader />
                        </div>
                    )}

                    {/* Mobile Scroll View */}
                    {!loading && (
                        <div
                            className="flex overflow-x-auto sm:hidden scrollbar-hide px-1 snap-x snap-mandatory scroll-smooth"
                            ref={scrollRef}
                            onScroll={handleScroll}
                        >
                            {filteredCars.length > 0 ? (
                                filteredCars.map((car) => (
                                    <div
                                        key={car.id}
                                        className="w-full flex-shrink-0 bg-zinc-800 rounded-2xl overflow-hidden p-2 shadow-lg snap-center"
                                    >
                                        <img
                                            src={car.thumbnail_image}
                                            alt={`${car.brand} ${car.model}`}
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <div className="mt-4 mx-4">
                                            <h3 className="text-lg font-semibold text-left">
                                                {`${car.brand} ${car.model} ${car.year}`}
                                            </h3>
                                            <p className="text-white text-3xl font-bold mt-1 text-left">
                                                {formatPrice(car.price_per_day)}
                                                <span className="text-sm font-normal">/day</span>
                                            </p>
                                            <div className="mt-4 bg-zinc-700 rounded-lg flex justify-between px-4 py-3 text-sm text-gray-200">
                                                <span className="flex flex-col items-center gap-1">
                                                    <img src={assets.ManualGearIcon} alt="" className="w-4 h-4" />
                                                    {car.transmission.split(" ")[0]}
                                                </span>
                                                <span className="flex flex-col items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {car.seats} Seats
                                                </span>
                                                <span className="flex flex-col items-center gap-1">
                                                    <Fuel className="w-4 h-4" />
                                                    {car.fuel_type}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => router.push(`/car-description/${car.id}`)}
                                                className="mt-4 mb-3 w-full bg-[#F3B753]  text-black py-2 rounded-lg font-semibold hover:bg-[#e3a640] transition cursor-pointer"
                                            >
                                                {t('common.bookNow')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 w-full mt-6">{t('carRental.noCarsAvailable')}</p>
                            )}
                        </div>
                    )}

                    {/* Pagination Dots */}
                    {!loading && filteredCars.length > 0 && (
                        <div className="flex justify-center mt-4 sm:hidden">
                            {filteredCars?.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`mx-1 h-2 w-2 rounded-full ${idx === activeIndex ? "bg-[#F3B753]" : "bg-gray-500"}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Desktop Grid */}
                    {!loading && (
                        <div className="hidden sm:grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                            {filteredCars.length > 0 ? (
                                filteredCars.map((car) => (
                                    <div key={car.id} className="bg-zinc-800 rounded-2xl overflow-hidden p-2 shadow-lg flex flex-col">
                                        <img 
                                            src={car.thumbnail_image} 
                                            alt={`${car.brand} ${car.model}`} 
                                            className="w-full h-48 object-cover rounded-xl" 
                                        />
                                        <div className="mt-4 mx-4">
                                            <h3 className="text-lg font-semibold text-left">
                                                {`${car.brand} ${car.model} ${car.year}`}
                                            </h3>
                                            <p className="text-white text-3xl font-bold mt-1 text-left">
                                                {formatPrice(car.price_per_day)}
                                                <span className="text-sm font-normal">/day</span>
                                            </p>
                                            <div className="mt-4 bg-zinc-700 rounded-lg flex justify-between px-4 py-3 text-sm text-gray-200">
                                                <span className="flex flex-col items-center gap-1">
                                                    <img src={assets.ManualGearIcon} alt="" className="w-4 h-4" />
                                                    {car.transmission.split(" ")[0]}
                                                </span>
                                                <span className="flex flex-col items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {car.seats} Seats
                                                </span>
                                                <span className="flex flex-col items-center gap-1">
                                                    <Fuel className="w-4 h-4" />
                                                    {car.fuel_type}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => router.push(`/car-description/${car.id}`)}
                                                className="mt-4 mb-3 w-full bg-[#F3B753] text-black py-2 rounded-lg font-semibold hover:bg-[#e3a640] transition cursor-pointer"
                                            >
                                                {t('common.bookNow')}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 col-span-full mt-6 text-center">
                                    {t('carRental.noCarsAvailable')}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <button 
                        onClick={() => router.push('/car-listing')}
                        className="px-6 py-2 border border-[#F3B753] text-[#F3B753] font-semibold rounded-lg hover:bg-[#F3B753] hover:text-black transition cursor-pointer"
                    >
                        {t('carRental.seeAllCars')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarRentalGrid;