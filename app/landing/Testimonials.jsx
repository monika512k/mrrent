'use client'
import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa6";
import { getTestimonials } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const Testimonials = () => {
  const { t } = useLanguage();
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef(null);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await getTestimonials(language);
      console.log('testimonials', response?.data);
      setTestimonials(response?.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchTestimonials();
  }, [language]);

  const cardsPerPage = {
    sm: 1,
    lg: 3,
  };

  const totalPages = Math.ceil(testimonials?.length / cardsPerPage.sm);

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / cardsPerPage.sm;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.offsetWidth / cardsPerPage.sm;
        const scrollPosition = carouselRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setCurrentIndex(newIndex);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      scrollToIndex(currentIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, isClient]);

  // Loading skeleton component
  const TestimonialSkeleton = () => (
    <div className="relative bg-gradient-to-br from-[#232323] to-[#181818] border-2 border-[#F3B753] rounded-2xl p-6 w-full max-w-[403px] flex-shrink-0 snap-center lg:w-1/3 animate-pulse">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-600"></div>
        <div>
          <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-20"></div>
        </div>
      </div>
      <div className="mt-2 mb-6 space-y-2">
        <div className="h-4 bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-6 h-6 bg-gray-600 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <section className="bg-[#111111] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12">
            {t('testimonials.subtitle')}
          </p>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {[...Array(3)].map((_, idx) => (
                <TestimonialSkeleton key={idx} />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-2 rounded-full bg-gray-600"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show loading state while fetching
  if (isLoading) {
    return (
      <section className="bg-[#111111] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12">
            {t('testimonials.subtitle')}
          </p>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {[...Array(3)].map((_, idx) => (
                <TestimonialSkeleton key={idx} />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-2 rounded-full bg-gray-600"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no testimonials
  if (testimonials.length === 0) {
    return (
      <section className="bg-[#111111] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12">
            {t('testimonials.subtitle')}
          </p>
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#111111] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
          {t('testimonials.title')}
        </h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          {t('testimonials.subtitle')}
        </p>
        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={`${testimonial.id || idx}-${testimonial.name}`}
                className="relative bg-gradient-to-br from-[#232323] to-[#181818] border-2 border-[#F3B753] rounded-2xl p-6 w-full max-w-[403px] flex-shrink-0 snap-center lg:w-1/3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=F3B753&color=111111&size=48`}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-[#F3B753] object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=F3B753&color=111111&size=48`;
                    }}
                  />
                  <div>
                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.location}</div>
                  </div>
                </div>
                <FaQuoteRight className="absolute top-6 right-6 text-[#F3B753] text-4xl opacity-80" />
                <p className="text-white mt-2 mb-6">{testimonial.content}</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-2xl ${
                        i < (testimonial.rating || 0) ? "text-[#F3B753]" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-4 h-2 rounded-full ${
                  i === currentIndex ? "bg-[#F3B753]" : "bg-gray-600"
                } transition-colors duration-300`}
                aria-label={t('testimonials.accessibility.goToTestimonial', { number: i + 1 })}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;