'use client'
import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface FiltersProps {
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    selectedCarTypes: string[];
    setSelectedCarTypes: (types: string[] | ((prev: string[]) => string[])) => void;
    selectedTransmission: string[];
    setSelectedTransmission: (types: string[] | ((prev: string[]) => string[])) => void;
    selectedFuel: string[];
    setSelectedFuel: (types: string[] | ((prev: string[]) => string[])) => void;
    clearFilters: () => void;
    mobileFiltersOpen: boolean;
    setMobileFiltersOpen: (open: boolean) => void;
}

type OpenSections = {
    price: boolean;
    carType: boolean;
    transmission: boolean;
    fuelType: boolean;
};

const Filters: React.FC<FiltersProps> = ({
    priceRange,
    setPriceRange,
    selectedCarTypes,
    setSelectedCarTypes,
    selectedTransmission,
    setSelectedTransmission,
    selectedFuel,
    setSelectedFuel,
    clearFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen
}) => {
    const [openSections, setOpenSections] = useState<OpenSections>({
        price: true,
        carType: true,
        transmission: true,
        fuelType: true,
    });

    const toggleSection = (section: keyof OpenSections) => {
        setOpenSections((prev: OpenSections) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCarTypeChange = (type: string) => {
        const newCarTypes = selectedCarTypes.includes(type) 
            ? selectedCarTypes.filter((t: string) => t !== type) 
            : [...selectedCarTypes, type];
        setSelectedCarTypes(newCarTypes);
    };

    const handleTransmissionChange = (type: string) => {
        const newTransmission = selectedTransmission.includes(type) 
            ? selectedTransmission.filter((t: string) => t !== type) 
            : [...selectedTransmission, type];
        setSelectedTransmission(newTransmission);
    };

    const handleFuelChange = (type: string) => {
        const newFuel = selectedFuel.includes(type) 
            ? selectedFuel.filter((t: string) => t !== type) 
            : [...selectedFuel, type];
        setSelectedFuel(newFuel);
    };

    const toggleMobileFilters = () => {
        setMobileFiltersOpen(!mobileFiltersOpen);
    };

    const renderAppliedFilters = () => (
        <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] backdrop-blur-lg">
            <div className="flex justify-between items-center w-full">
                <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">Applied Filters</span>
                <button onClick={clearFilters} className="font-['Poppins'] font-semibold text-base text-[#F3B753] cursor-pointer">
                    Clear All
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
                {selectedCarTypes.length>0&&selectedCarTypes?.map((type: string) => (
                    <div key={type} className="flex items-center gap-1 px-4 py-2 bg-[#454545]/30 border border-[#F6F6F6]/40 rounded-full opacity-40">
                        <span className="font-['Poppins'] font-medium text-sm text-[#F6F6F6]">{type}</span>
                        <svg width="19.2" height="19.2" viewBox="0 0 19.2 19.2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.76 5.76L13.44 13.44M13.44 5.76L5.76 13.44" stroke="#F6F6F6" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPriceFilter = () => (
        <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] backdrop-blur-lg">
            <button 
                onClick={() => toggleSection('price')}
                className="flex justify-between items-center w-full cursor-pointer"
            >
                <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">Price</span>
                <ChevronDown className={`w-6 h-6 text-[#F6F6F6] transition-transform duration-200 ${openSections.price ? 'rotate-180' : ''}`} />
            </button>
            {openSections.price && (
                <div className="mt-2">
                    <div className="relative pt-6">
                        {/* Price Range Display */}
                        <div className="flex justify-between mb-4 text-sm text-[#F6F6F6]/60 font-['Poppins']">
                            <span>€ {priceRange[0].toLocaleString()}</span>
                            <span>€ {priceRange[1].toLocaleString()}</span>
                        </div>
                        
                        {/* Range Track */}
                       
          
                            {/* Range Inputs */}
                            <RangeSlider 
                                className='slider_custom'
                                value={priceRange}
                                min={0}
                                max={120000}
                                step={1000}
                                onInput={setPriceRange}
                            />
                    
                        {/* Price Input Fields */}
                        <div className="flex gap-4 mt-6">
                            <div className="flex-1">
                                <label className="block text-xs text-[#F6F6F6]/60 mb-1">Min Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F6F6F6]/60">€</span>
                                    <input
                                        type="number"
                                        value={priceRange[0]||''}
                                        onChange={(e) => {
                                            const newMin = Number(e.target.value);
                                            setPriceRange([
                                                Math.min(newMin, priceRange[1]),
                                                priceRange[1]
                                            ]);
                                        }}
                                        min="0"
                                        max={priceRange[1]}
                                        className="w-full pl-8 pr-3 py-2 bg-[#F6F6F6]/10 border border-[#F6F6F6]/20 rounded-lg text-[#F6F6F6] text-sm focus:outline-none focus:border-[#F3B753]"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-[#F6F6F6]/60 mb-1">Max Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F6F6F6]/60">€</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]||''}
                                        onChange={(e) => {
                                            const newMax = Number(e.target.value);
                                            setPriceRange([
                                                priceRange[0],
                                                Math.min(newMax, 120000)
                                            ]);
                                        }}
                                        min={priceRange[0]}
                                        max="120000"
                                        className="w-full pl-8 pr-3 py-2 bg-[#F6F6F6]/10 border border-[#F6F6F6]/20 rounded-lg text-[#F6F6F6] text-sm focus:outline-none focus:border-[#F3B753]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderCarTypeFilter = () => (
        <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] backdrop-blur-lg">
            <button 
                onClick={() => toggleSection('carType')}
                className="flex justify-between items-center w-full cursor-pointer"
            >
                <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">Car Type</span>
                <ChevronDown className={`w-6 h-6 text-[#F6F6F6] transition-transform duration-200 ${openSections.carType ? 'rotate-180' : ''}`} />
            </button>
            {openSections.carType && (
                <div className="flex flex-col gap-2 mt-2">
                    {['Sedan', 'SUV', 'Wagon', 'Crossover', 'Coupe', 'Pickup'].map((type: string) => (
                        <label key={type} className={`flex items-center gap-3 ${!selectedCarTypes.includes(type) ? 'opacity-40' : ''}`}>
                            <input
                                type="checkbox"
                                checked={selectedCarTypes.includes(type)}
                                onChange={() => handleCarTypeChange(type)}
                                className="w-[15px] h-[15px] rounded-sm bg-[#747474] border-none appearance-none checked:bg-[#111827] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M5.625%2010.125L2.5%207L1.25%208.25L5.625%2012.5L12.5%205.625L11.25%204.375L5.625%2010.125Z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat cursor-pointer"
                            />
                            <span className="font-['Poppins'] text-sm text-[#F6F6F6]">{type}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    const renderTransmissionFilter = () => (
        <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] backdrop-blur-lg">
            <button 
                onClick={() => toggleSection('transmission')}
                className="flex justify-between items-center w-full cursor-pointer"
            >
                <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">Transmission</span>
                <ChevronDown className={`w-6 h-6 text-[#F6F6F6] transition-transform duration-200 ${openSections.transmission ? 'rotate-180' : ''}`} />
            </button>
            {openSections.transmission && (
                <div className="flex flex-col gap-2 mt-2">
                    {['Manual', 'Automatic'].map((type: string) => (
                        <label key={type} className={`flex items-center gap-3 ${!selectedTransmission.includes(type) ? 'opacity-40' : ''}`}>
                            <input
                                type="checkbox"
                                checked={selectedTransmission.includes(type)}
                                onChange={() => handleTransmissionChange(type)}
                                className="w-[15px] h-[15px] bg-[#747474] border-none rounded-sm appearance-none checked:bg-[#111827] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M5.625%2010.125L2.5%207L1.25%208.25L5.625%2012.5L12.5%205.625L11.25%204.375L5.625%2010.125Z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat cursor-pointer"
                            />
                            <span className="font-['Poppins'] text-sm text-[#F6F6F6]">{type}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    const renderFuelTypeFilter = () => (
        <div className="flex flex-col p-4 rounded-lg bg-gradient-to-b from-[rgba(255,242,221,0.05)] to-[rgba(235,233,230,0.05)] backdrop-blur-lg">
            <button 
                onClick={() => toggleSection('fuelType')}
                className="flex justify-between items-center w-full cursor-pointer"
            >
                <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">Fuel Type</span>
                <ChevronDown className={`w-6 h-6 text-[#F6F6F6] transition-transform duration-200 ${openSections.fuelType ? 'rotate-180' : ''}`} />
            </button>
            {openSections.fuelType && (
                <div className="flex flex-col gap-2 mt-6">
                    {['Petrol', 'Diesel', 'Electric'].map((type: string) => (
                        <label key={type} className={`flex items-center gap-3 ${!selectedFuel.includes(type) ? 'opacity-40' : ''}`}>
                            <input
                                type="checkbox"
                                checked={selectedFuel.includes(type)}
                                onChange={() => handleFuelChange(type)}
                                className="w-[15px] h-[15px] bg-[#747474] rounded-sm appearance-none checked:bg-[#111827] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M5.625%2010.125L2.5%207L1.25%208.25L5.625%2012.5L12.5%205.625L11.25%204.375L5.625%2010.125Z%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat cursor-pointer"
                            />
                            <span className="font-['Poppins'] text-sm text-[#F6F6F6]">{type}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Filters */}
            <div className="hidden md:block col-span-3 flex flex-col space-y-2 gap-4">
                {renderAppliedFilters()}
                {renderPriceFilter()}
                {renderCarTypeFilter()}
                {renderTransmissionFilter()}
                {renderFuelTypeFilter()}
            </div>

            {/* Mobile Filters Toggle and Drawer */}
            <div className="fixed bottom-0 left-0 w-full bg-[#121212] z-[999999] pb-4 shadow-lg md:hidden">
                <div 
                    className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg cursor-pointer"
                    onClick={toggleMobileFilters}
                >
                    <span className="font-['Poppins'] font-semibold text-base text-[#F6F6F6]">Filters</span>
                    <ChevronDown className={`w-6 h-6 text-[#F6F6F6] transition-transform duration-200 ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <div className={`fixed bottom-0 left-0 w-full backdrop-blur-[38px] z-[99999] transform transition-all duration-300 ease-in-out 
                            ${mobileFiltersOpen ? 'translate-y-0 max-h-[90vh]' : 'translate-y-full max-h-0'}
                            md:hidden rounded-t-xl overflow-y-scroll`}>
                <div className="overflow-y-scroll h-full p-4">
                    {renderAppliedFilters()}
                    {renderPriceFilter()}
                    {renderCarTypeFilter()}
                    {renderTransmissionFilter()}
                    {renderFuelTypeFilter()}
                </div>
            </div>
        </>
    );
};

export default Filters;