"use client"
import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import {
  Star,
  ShieldCheck,
  Wallet,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "app/context/LanguageContext";

const About = () => {
    const router = useRouter();
    const {t} = useLanguage()

  const aboutPages = [
    { name: t('about.breadcrumb'), href: "/about-us", current: true },
  ];

  const features = [
    {
      icon: <Star className="text-yellow-400 w-12 h-12" />, // 48px
      label: t('about.features.premiumBudget'),
    },
    {
      icon: <ShieldCheck className="text-yellow-400 w-12 h-12" />, // 48px
      label: t('about.features.sanitizedVerified'),
    },
    {
      icon: <Wallet className="text-yellow-400 w-12 h-12" />, // 48px
      label: t('about.features.transparentPricing'),
    },
    {
      icon: <Headphones className="text-yellow-400 w-12 h-12" />, // 48px
      label: t('about.features.assistance'),
    },
  ];

  return (
    <div className="bg-[#121212] text-white px-6 pt-20 pb-10 md:px-24">
      <div className="mt-6 lg:mt-16">
        {/* Breadcrumb */}
        <Breadcrumb pages={aboutPages} />

        {/* Title Section */}
        <div className="grid md:grid-cols-2 gap-10 ">
        <div className="text-center md:text-left flex flex-col justify-start items-center md:items-start">
            <h4 className="uppercase text-base font-semibold text-[#F6F6F6] mb-3">{t('about.sectionLabel')}</h4>
            <h2 className="lg:text-[40px] text-3xl font-extrabold mb-6 leading-snug">
              {t('about.heading')}
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-xl">
              {t('about.description')}
            </p>
            <button className="bg-[#F3B753] cursor-pointer hover:bg-yellow-500 text-black font-semibold px-7 py-4 rounded-md transition" onClick={()=> router.push(`/car-listing`)}>
            {t('common.bookNow')}
            </button>
          </div>

          {/* Feature Cards */}
          <div className="relative w-[275px] h-[582px] mx-auto">
            <div className="absolute rotate-90 w-[582px] h-[275px] left-[-151px] top-40 bg-gradient-to-b from-[rgba(243,183,83,0.1)] to-[rgba(235,233,230,0.1)] backdrop-blur-[18.6px] rounded-lg border border-yellow-500/30"></div>
            <div className="absolute w-[225px] h-[524px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div>{feature.icon}</div>
                  <div className="text-[18px] font-semibold text-[#F6F6F6] text-center font-[Poppins] leading-[27px]">
                    {feature.label}
                  </div>
                  {index !== features.length - 1 && (
                    <div className="w-[164px] h-px bg-white opacity-20 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;