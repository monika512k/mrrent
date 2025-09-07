'use client'
import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Newsletter = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[#F3B753] py-16 px-4 rounded-bl-[60px] rounded-tr-[60px] mt-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-xl md:text-4xl font-extrabold text-black mb-4">
          {t('newsletter.title')}
        </h2>
        <p className="text-lg text-black mb-10">
          {t('newsletter.description')}
        </p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder={t('newsletter.emailPlaceholder')}
            className="w-full sm:w-96 px-5 py-2 rounded-md border border-[#F3B753] focus:outline-none focus:ring-2 focus:ring-black text-lg bg-white text-black"
          />
          <button
            type="submit"
            className="w-auto px-10 py-2 bg-black text-[#F3B753] font-bold rounded-md hover:bg-gray-900 transition text-lg"
          >
            {t('newsletter.subscribeButton')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;