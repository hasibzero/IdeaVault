import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    // Outer container adds some padding so the rounded corners of the image are visible
    <section className="w-full px-4 sm:px-6 lg:px-12 py-6">
      
      
      <div 
        className="relative w-full rounded-[2rem] overflow-hidden min-h-[450px] sm:min-h-[500px] lg:min-h-[600px] flex items-center shadow-xl"
        style={{ 
          backgroundImage: "url('/asset/bg-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 via-blue-600/60 to-transparent dark:from-blue-950/95 dark:via-blue-900/70 dark:to-transparent/20"></div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full max-w-3xl px-8 sm:px-12 md:px-16 lg:px-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Fuel Your Innovation
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-50/90 mb-10 max-w-lg leading-relaxed">
            Transform raw sparks into viable products within a structured, collaborative ecosystem designed for visionaries.
          </p>
          
          {/* Shadcn Button overridden with custom styles to match the rounded pill design */}
          <Button 
            className="bg-white text-blue-700 hover:bg-gray-100 dark:bg-white dark:text-blue-700 dark:hover:bg-gray-200 rounded-full px-10 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105"
          >
            <Link href={'/ideas'}>Explore Ideas</Link>
            
          </Button>
        </div>

      </div>
    </section>
  );
}