'use client'
import React from 'react';

import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();
 
    return (
        <section className="hero-section lg:bg-center md:bg-center bg-[-26.125rem] text-white min-h-[90vh] flex flex-col justify-start items-center px-4 md:px-8 py-20">
            {/* Hero Text */}
            <div className="max-w-5xl text-center space-y-6 mt-24 mb-10 md:px-6">
                <h1 className="font-poppins font-bold text-2xl md:text-4xl lg:text-[4rem] leading-tight md:leading-[80px]">
                    {t('hero.title.part1')} <span className="text-[#F3B753]">{t('hero.title.part2')}</span> {t('hero.title.part3')}
                </h1>
                <p className="text-sm md:text-base lg:text-base text-gray-300 max-w-3xl mx-auto">
                    {t('hero.description')}
                </p>
            </div>

            {/* Form Section */}
            
         
        </section>
    );
};

export default Hero;
