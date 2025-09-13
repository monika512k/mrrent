'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, FileText, History, MessageSquare, Star, AlertCircle, HelpCircle, LogOut } from 'lucide-react';
import assets from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [userName , setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useLanguage();
  const dropdownRef = useRef(null);



  useEffect(() => {
     
    setIsLoggedIn(window&&localStorage.getItem("user_loggedin") === "true");
    setUserName(JSON.parse(window&&localStorage.getItem("user"))?.name);
  }, []);
  console.log("isLoggedin",isLoggedin)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: t('navigation.aboutUs'), href: '/about-us' },
    { label: t('navigation.contactUs'), href: '/contact-us' },
  ];

  const dropdownItems = [
    { icon: User, label: 'Account Details', href: '/user-profile/account-details' },
    { icon: FileText, label: 'License Management', href: '/user-profile/license-management' },
    { icon: History, label: 'Rental History', href: '/user-profile/rental-history' },
    { icon: MessageSquare, label: 'Feedback Section', href: '/user-profile/feedback-section' },
    { icon: Star, label: 'Rate Rental', href: '/user-profile/rate-rental' },
    { icon: AlertCircle, label: 'Submit Complaint', href: '/user-profile/submit-complaint' },
    { icon: HelpCircle, label: 'Contact Support', href: '/user-profile/contact-support' },
  ];

  const handleLogout = () => {
    localStorage.setItem("user_loggedin", "false");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    // Add any additional logout logic here
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#121212B2] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
        {/* Logo */}
        <Link href="/landing" aria-label={t('accessibility.home')}>
          <img
            src={assets.logo}
            alt={t('accessibility.logo')}
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-white font-poppins font-semibold text-base">
          {/* Show navigation links only when not logged in */}
          { navLinks.length>0&&navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="hover:text-[#F3B753] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Language Switcher - only when not logged in */}
          { <LanguageSwitcher />}

          {/* Book Now Button - only when not logged in */}
         
            <Link href="/car-listing">
              <button
                className="py-2 px-4 border border-[#F3B753] text-[#F3B753] rounded-lg hover:bg-[#F3B753] hover:text-black transition-colors cursor-pointer"
                aria-label={t('common.bookNow')}
                
              >
                {t('common.bookNow')}
              </button>
            </Link>
         

          {/* Login/User Dropdown */}
          {isLoggedin ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 py-2 px-4 bg-[#1D1D1D] text-white rounded-lg hover:bg-[#1D1D1D] transition-colors cursor-pointer border border-white"
                aria-label="User menu"
              >
                <User size={16} />
                Hi, {userName&&userName}
                <ChevronDown size={16} className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] outline outline-[0.5px] outline-[#F3B753] rounded-lg shadow-lg overflow-hidden">
                  {dropdownItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2a2a2a] transition-colors border-b border-gray-700 last:border-b-0"
                    >
                      <item.icon size={16} className="text-gray-400" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2a2a2a] transition-colors w-full text-left"
                  >
                    <LogOut size={16} className="text-gray-400" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button
                className="py-2 px-6 bg-[#F3B753] text-black rounded-lg hover:bg-[#e3a640] transition-colors cursor-pointer"
                aria-label={t('common.logIn')}
              >
                {t('common.logIn')}
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Right Side: Book Now + Menu (Book Now only when not logged in) */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Book Now (Mobile Only) - only when not logged in */}
          {!isLoggedin && (
            <Link href="/landing">
              <button
                className="block md:hidden py-2 px-4 border border-[#F3B753] text-[#F3B753] rounded-lg hover:bg-[#F3B753] hover:text-black transition-colors cursor-pointer"
                aria-label={t('common.bookNow')}
              >
                {t('common.bookNow')}
              </button>
            </Link>
          )}

          {/* Hamburger Icon */}
          <button
            className="text-white hover:text-[#F3B753] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <Menu size={32} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-80 bg-[#121212] text-white font-poppins z-40 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white hover:text-[#F3B753] transition-colors"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
        </div>

        <nav className="flex flex-col bg-[#121212] min-h-screen font-medium">
          {/* Show user profile section when logged in */}
          {isLoggedin ? (
            <>
              {/* User Profile Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">{userName&&userName}</div>
                  {/* <div className="text-gray-400 text-sm">Kumar</div> */}
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col pt-4">
                {/* Main menu items with icons and arrows */}
                <Link
                  href="/account-details"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-6 py-4 text-white hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400" />
                    <span>Account Details</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                </Link>

                <Link
                  href="/license-management"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-6 py-4 text-white hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400" />
                    <span>License Management</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                </Link>

                <Link
                  href="/rental-history"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-6 py-4 text-white hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <History size={18} className="text-gray-400" />
                    <span>Rental History</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                </Link>

                {/* Feedback Section (no arrow) */}
                <div className="px-6 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={18} className="text-gray-400" />
                    <span>Feedback Section</span>
                  </div>
                </div>

                {/* Sub-items with indentation */}
                <Link
                  href="/rate-rental"
                  onClick={() => setMobileOpen(false)}
                  className="px-12 py-3 text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  Rate Rental
                </Link>

                <Link
                  href="/submit-complaint"
                  onClick={() => setMobileOpen(false)}
                  className="px-12 py-3 text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  Submit Complaint
                </Link>

                <Link
                  href="/contact-support"
                  onClick={() => setMobileOpen(false)}
                  className="px-12 py-3 text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  Contact Support
                </Link>

                {/* Log Out */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-between px-6 py-4 text-white hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-gray-400" />
                    <span>Log Out</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Show navigation links only when not logged in */}
              <div className="flex flex-col gap-6 px-6 text-lg font-semibold pt-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-[#F3B753] transition-colors text-white"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Login */}
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-[#F3B753] transition-colors text-white"
                >
                  {t('common.logIn')}
                </Link>

                {/* Language Switcher */}
                <div className="mt-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;