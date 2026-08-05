"use client";

import React from 'react';
import Link from 'next/link';

// Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Define your 3 slides here to keep the code clean
const slidesData = [
  {
    id: 1,
    title: "Introducing IdeaVault",
    subtitle: "A curated hub where developers, visionaries, and creators come together to discover, share, and shape the next generation of software products.",
    buttonText: "Explore Ideas",
    link: "/ideas",
    bgImage: "/asset/bg-hero.png",
  },
 
  {
    id: 2,
    title: "Launch Your Startup",
    subtitle: "Turn your side project into a profitable business. Access the tools and feedback you need to scale.",
    buttonText: "Start Building",
    link: "/ideas/new", 
    bgImage: "https://static.vecteezy.com/system/resources/thumbnails/020/410/750/small/illustration-of-startup-business-plan-project-development-from-idea-to-realisation-creative-concept-for-web-banner-social-media-banner-business-presentation-marketing-material-vector.jpg", 
  },
  {
    id: 3,
    title: "Validate Your Vision",
    subtitle: "Get actionable feedback from early adopters and fellow programmers before you write a single line of code.",
    buttonText: "Share Your Vision",
    link: "/ideas/new",
    bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
  }
];

export default function Hero() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-6">
      
      {/* 
        The Swiper component acts as the main wrapper. 
        We pass in a custom CSS variable to make the pagination dots white.
      */}
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }} 
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="rounded-[2rem] shadow-xl w-full"
        style={{
          "--swiper-pagination-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-color": "rgba(255,255,255,0.4)",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "10px",
        }}
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="relative w-full overflow-hidden min-h-112.5 sm:min-h-125 lg:min-h-150 flex items-center"
              style={{ 
                backgroundImage: `url('${slide.bgImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark/Blue Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-700/90 via-blue-600/60 to-transparent dark:from-blue-950/95 dark:via-blue-900/70 dark:to-transparent/20"></div>

              {/* Text Content */}
              <div className="relative z-10 w-full max-w-3xl px-8 sm:px-12 md:px-16 lg:px-24">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                  {slide.title}
                </h1>
                
                <p className="text-lg sm:text-xl text-blue-50/90 mb-10 max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>
                
                <Link
                  href={slide.link}
                  className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-gray-100 dark:bg-white dark:text-blue-700 dark:hover:bg-gray-200 rounded-full px-10 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
    </section>
  );
}