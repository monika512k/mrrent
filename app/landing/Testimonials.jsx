'use client'
import React, { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa6";
import { getTestimonials } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

// const testimonials = [
//   {
//     name: "Jayesh P.",
//     location: "Mumbai, MH",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     review:
//       "Booking was seamless, and the car was spotless. Drove across the city without a worry. Highly recommend!",
//     rating: 5,
//   },
//   {
//     name: "Aarti S.",
//     location: "Delhi, DL",
//     avatar: "https://randomuser.me/api/portraits/women/45.jpg",
//     review:
//       "The service was fantastic, and the car was in perfect condition. Will definitely use again!",
//     rating: 5,
//   },
//   {
//     name: "Rohan M.",
//     location: "Bangalore, KA",
//     avatar: "https://randomuser.me/api/portraits/men/12.jpg",
//     review:
//       "Great experience! The booking process was easy, and the car was delivered on time.",
//     rating: 4,
//   },
//   {
//     name: "Priya K.",
//     location: "Chennai, TN",
//     avatar: "https://randomuser.me/api/portraits/women/23.jpg",
//     review:
//       "Loved the flexibility and customer support. Made my trip hassle-free!",
//     rating: 4,
//   },
//   {
//     name: "Aarti S.",
//     location: "Delhi, DL",
//     avatar: "https://randomuser.me/api/portraits/women/45.jpg",
//     review:
//       "The service was fantastic, and the car was in perfect condition. Will definitely use again!",
//     rating: 5,
//   },
//   {
//     name: "Rohan M.",
//     location: "Bangalore, KA",
//     avatar: "https://randomuser.me/api/portraits/men/12.jpg",
//     review:
//       "Great experience! The booking process was easy, and the car was delivered on time.",
//     rating: 4,
//   },
// ];

const Testimonials = () => {
  const { t } = useLanguage();
  const { language  } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const carouselRef = useRef(null);

  const fetchTestimonials = async () => {
    const testimonials = await getTestimonials(language);
    console.log('testimonials',testimonials?.data);
    setTestimonials(testimonials?.data);
  }
  useEffect(() => {
    fetchTestimonials();
  }, []);
  const cardsPerPage = {
    sm: 1,
    lg: 3,
  };

  const totalPages = Math.ceil(testimonials.length / cardsPerPage.sm);

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
  }, []);

  useEffect(() => {
    const handleResize = () => {
      scrollToIndex(currentIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

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
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="relative bg-gradient-to-br from-[#232323] to-[#181818] border-2 border-[#F3B753] rounded-2xl p-6 w-full max-w-[403px] flex-shrink-0 snap-center lg:w-1/3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={t.avatar||"https://randomuser.me/api/portraits/men/32.jpg"}
                    alt={t.name}
                    className="w-12 h-12 rounded-full border-2 border-[#F3B753] object-cover"
                  />
                  <div>
                    <div className="font-bold text-white text-lg">{t.name}</div>
                    <div className="text-gray-400 text-sm">{t.location}</div>
                  </div>
                </div>
                <FaQuoteRight className="absolute top-6 right-6 text-[#F3B753] text-4xl opacity-80" />
                <p className="text-white mt-2 mb-6">{t.content}</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-2xl ${
                        i < t.rating ? "text-[#F3B753]" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
      </div>
    </section>
  );
};

export default Testimonials;