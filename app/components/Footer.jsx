'use client';

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import assets from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const companyLinks = [
    { label: t('footer.company.aboutUs'), href: '/about-us' },
  ];

  const serviceLinks = [
    { label: t('footer.services.carRentals'), href: '#' },
    { label: t('footer.services.hourlyRentals'), href: '#' },
    { label: t('footer.services.luxuryCarHire'), href: '#' },
    { label: t('footer.services.outstationTravel'), href: '#' },
  ];

  const supportLinks = [
    { label: t('footer.support.contactUs'), href: '/contact-us' },
    { label: t('footer.support.cancellationPolicy'), href: '/cancellation-policy' },
    { label: t('footer.support.termsConditions'), href: '/terms-conditions' },
    { label: t('footer.support.privacyPolicy'), href: '/privacy-policy' },
  ];

  const socialIcons = [
    { Icon: FaFacebookF, href: '#', label: t('footer.social.facebook') },
    { Icon: FaTwitter, href: '#', label: t('footer.social.twitter') },
    { Icon: FaInstagram, href: '#', label: t('footer.social.instagram') },
    { Icon: FaLinkedinIn, href: '#', label: t('footer.social.linkedin') },
    { Icon: FaWhatsapp, href: '#', label: t('footer.social.whatsapp') },
  ];

  return (
    <footer className="bg-[#121212] text-white font-poppins px-4 py-8 sm:px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Columns Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.company.title')}</h3>
              <ul className="space-y-2 text-sm text-[#D1D1D1]">
                {companyLinks.length>0&&companyLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-[#F3B753] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.services.title')}</h3>
              <ul className="space-y-2 text-sm text-[#D1D1D1]">
                {serviceLinks.length>0&&serviceLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-[#F3B753] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-lg mb-4">{t('footer.support.title')}</h3>
              <ul className="space-y-2 text-sm text-[#D1D1D1]">
                {supportLinks.length>0&&supportLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-[#F3B753] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logo and Social Icons */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src={assets.logo} alt={t('accessibility.logo')} className="w-16 h-16 object-contain" />
            <div className="flex gap-4">
              {socialIcons.length>0&&socialIcons.map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={label}
                  className="text-[#F3B753] text-2xl hover:scale-110 transition-transform"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 text-center text-sm text-[#A1A1A1]">
          {t('footer.copyright.text')}{' '}
          <a href="#" className="text-white hover:text-[#F3B753] transition-colors">
            {t('footer.copyright.poweredBy')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;