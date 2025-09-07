'use client';

import React from 'react';
import assets from "../assets/assets";
import { useLanguage } from '../context/LanguageContext';

const StepsSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="flex flex-col items-start pt-44 pb-10 px-4 lg:px-4 md:px-8 lg:py-16 md:py-40 w-full min-h-[600px] md:min-h-[965.18px]  ">
      <div className="flex flex-col items-center lg:28 md:px-8 gap-6 md:gap-10 w-full">
        <div className="flex flex-col items-center gap-3 md:gap-4 w-full">
          <h2 className="font-poppins font-bold text-4xl lg:text-5xl md:text-4xl leading-tight text-white text-center w-[280px] lg:w-full">
            {t('steps.title')}
          </h2>
          <p className="font-poppins font-normal text-base md:text-lg leading-6 tracking-wide text-white text-center w-[226px] lg:w-full">
            {t('steps.subtitle')}
          </p>
        </div>
        <div className="relative w-full h-auto">
          <img
            src={assets.herobg1}
            alt="Roadmap desktop"
            className="hidden md:block w-full h-auto"
          />
          <img
            src={assets.herobgMobile}
            alt="Roadmap mobile"
            className="block md:hidden w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
