"use client"
import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import assets from "../assets/assets";
import { useLanguage } from '../context/LanguageContext';

const ContactUs = () => {
  const { t } = useLanguage();
  const contactPages = [
    { name: t('navigation.contactUs'), href: "/contact-us", current: true },
  ];

  return (
    <div className="bg-[#121212] text-white px-6 pt-20 pb-10 md:px-24">
      <div className="mt-6 lg:mt-16">
        {/* Breadcrumb */}
        <Breadcrumb pages={contactPages} />

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-[40px] font-bold ">{t('navigation.contactUs')}</h2>
          <p className="text-[#454545] mt-2 text-lg font-medium">
            {t('contactUs.subtitle')}
          </p>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col md:flex-row bg-gradient-to-br from-[#1C1C1C] to-[#121212] rounded-xl border border-yellow-700/30 backdrop-blur-[18px] px-8 py-12 gap-10 items-center">
          
          {/* Left: Illustration */}
          <div className="flex-1 flex justify-center">
            <Image src={assets.ContactUs} alt={t('accessibility.logo')} width={400} height={400} className="max-w-xs md:max-w-md" />
          </div>

          {/* Right: Contact Info */}
          <div className="flex-1 space-y-6">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <Phone className="text-[#F3B753] w-6 h-6" />
              <span className="text-lg">+49 3456 789</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <Mail className="text-[#F3B753] w-6 h-6" />
              <span className="text-lg">demo@gmail.com</span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <MapPin className="text-[#F3B753] w-6 h-6 mt-1" />
              <span className="text-lg">
                132 Dartmouth Street Boston,<br />
                Massachusetts 02156 United States
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-5 pt-4">
              {[Facebook, Twitter, Instagram, Linkedin, MessageCircle].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className="w-8 h-8 text-black bg-[#F3B753] p-1.5 rounded-full hover:bg-yellow-500 cursor-pointer transition"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
