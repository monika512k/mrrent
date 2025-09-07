'use client'
import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../context/LanguageContext';

interface FormInputs {
    pickupLocation: string;
    pickupDate: string;
    dropoffLocation: string;
    dropoffDate: string;
}

interface CarSearchProps {
    onSearch?: (searchData: FormInputs) => void;
    locations?: Array<{id: string, name: string, address: string}>;
    className?: string;
}

const CarSearch = ({ onSearch, locations = [], className = "" }: CarSearchProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    const { t } = useLanguage();

    const onSubmit = (data: FormInputs) => {
        console.log('Search data:', data);
        
        // If onSearch prop is provided, use it (for custom handling)
        if (onSearch) {
            onSearch(data);
        } else {
            // Default behavior - show alert
            alert('Finding vehicles with your preferences! Check console for data.');
        }
    };

    return (
        <div className={`flex justify-center ${className}`}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="car_search absolute lg:bottom-0 md:-bottom-36 -bottom-12 w-full max-w-[1232px] bg-white/10 backdrop-blur-[28px] rounded-2xl shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] p-6 md:p-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
                {/* Pick-up Location */}
                <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
                    <label htmlFor="pickupLocation" className="text-[#F6F6F6] text-base font-semibold opacity-80">
                        {t('hero.form.pickupLocation.label')}
                    </label>
                    <div className="bg-[#F6F6F6] border border-black/10 rounded-lg p-4 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#454545]" />
                        {locations.length > 0 ? (
                            <select
                                id="pickupLocation"
                                className="bg-transparent outline-none text-[#454545] text-base font-normal w-full"
                                {...register("pickupLocation", { required: t('hero.form.pickupLocation.error') })}
                            >
                                <option value="">{t('hero.form.pickupLocation.placeholder')}</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.address}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                id="pickupLocation"
                                placeholder={t('hero.form.pickupLocation.placeholder')}
                                className="bg-transparent outline-none text-[#454545] text-base font-normal w-full placeholder:text-[#454545]"
                                {...register("pickupLocation", { required: t('hero.form.pickupLocation.error') })}
                            />
                        )}
                    </div>
                    {errors.pickupLocation && <p className="text-red-500 text-sm">{errors.pickupLocation.message?.toString()}</p>}
                </div>

                {/* Pick-up Date */}
                <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
                    <label htmlFor="pickupDate" className="text-[#F6F6F6] text-base font-semibold opacity-80">
                        {t('hero.form.pickupDate.label')}
                    </label>
                    <div className="bg-[#F6F6F6] border border-black/10 rounded-lg p-4 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#454545]" />
                        <input
                            type="date"
                            id="pickupDate"
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                            className="bg-transparent outline-none text-[#454545] text-base text-end font-normal w-full custom-date-input"
                            {...register("pickupDate", { required: t('hero.form.pickupDate.error') })}
                        />
                    </div>
                    {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate.message?.toString()}</p>}
                </div>

                {/* Drop-off Location */}
                <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
                    <label htmlFor="dropoffLocation" className="text-[#F6F6F6] text-base font-semibold opacity-80">
                        {t('hero.form.dropoffLocation.label')}
                    </label>
                    <div className="bg-[#F6F6F6] border border-black/10 rounded-lg p-4 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#454545]" />
                        {locations.length > 0 ? (
                            <select
                                id="dropoffLocation"
                                className="bg-transparent outline-none text-[#454545] text-base font-normal w-full"
                                {...register("dropoffLocation", { required: t('hero.form.dropoffLocation.error') })}
                            >
                                <option value="">{t('hero.form.dropoffLocation.placeholder')}</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.address}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                id="dropoffLocation"
                                placeholder={t('hero.form.dropoffLocation.placeholder')}
                                className="bg-transparent outline-none text-[#454545] text-base font-normal w-full placeholder:text-[#454545]"
                                {...register("dropoffLocation", { required: t('hero.form.dropoffLocation.error') })}
                            />
                        )}
                    </div>
                    {errors.dropoffLocation && <p className="text-red-500 text-sm">{errors.dropoffLocation.message?.toString()}</p>}
                </div>

                {/* Drop-off Date */}
                <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
                    <label htmlFor="dropoffDate" className="text-[#F6F6F6] text-base font-semibold opacity-80">
                        {t('hero.form.dropoffDate.label')}
                    </label>
                    <div className="bg-[#F6F6F6] border border-black/10 rounded-lg p-4 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#454545]" />
                        <input
                            type="date"
                            id="dropoffDate"
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                            className="bg-transparent outline-none text-[#454545] text-end text-base font-normal w-full custom-date-input"
                            {...register("dropoffDate", { required: t('hero.form.dropoffDate.error') })}
                        />
                    </div>
                    {errors.dropoffDate && <p className="text-red-500 text-sm">{errors.dropoffDate.message?.toString()}</p>}
                </div>

                {/* Submit Button */}
                <div className="col-span-2 md:col-span-2 lg:col-span-1 flex items-end justify-center">
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-[#F3B753] text-[#121212] font-semibold text-base rounded-lg px-6 py-4 w-full hover:bg-[#e3a640] transition-colors"
                    >
                        {t('hero.form.submitButton')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CarSearch;