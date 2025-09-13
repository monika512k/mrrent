'use client'
import React from 'react'
import { FaCarSide, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ConfidenceSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <FaCarSide className="text-yellow-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />,
      title: t('confidence.features.fleet.title'),
      description: t('confidence.features.fleet.description'),
    },
    {
      icon: <FaMoneyBillWave className="text-yellow-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />,
      title: t('confidence.features.pricing.title'),
      description: t('confidence.features.pricing.description'),
    },
    {
      icon: <FaHeadset className="text-yellow-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />,
      title: t('confidence.features.support.title'),
      description: t('confidence.features.support.description'),
    },
  ];

  return (
    <section className="text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4">
          {t('confidence.title')}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
          {t('confidence.description')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {features.length>0&&features.map((feature, index) => (
            <div
              key={index}
              className="w-full p-4 sm:p-5 rounded-md border-2 shadow-md text-left transition-transform hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(180.29deg, rgba(243, 183, 83, 0.1) -14.09%, rgba(235, 233, 230, 0.1) 141.86%)",
                borderImage:
                  "linear-gradient(132.88deg, rgba(249, 172, 29, 0.25) -0.01%, rgba(246, 225, 155, 0.05) 102.43%) 1",
                backdropFilter: "blur(37.2px)",
                minHeight: "200px",
              }}
            >
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ConfidenceSection
