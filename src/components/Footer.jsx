import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f4f7fb] dark:bg-gray-950  border-gray-200 dark:border-gray-800 pt-16 pb-12 px-6 lg:px-12 mt-auto">
      <hr className='max-w-7xl mx-auto pb-10'/>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-24 ">
        
        <div className="flex flex-col max-w-sm">
          <Link 
            href="/" 
            className="text-2xl font-extrabold text-blue-700 dark:text-blue-500 mb-6 tracking-tight"
          >
            IdeaVault
          </Link>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base mb-16">
            Fueling the next generation of startups. A professional space to store, validate, and collaborate on your best ideas.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} IdeaVault. Fueling the next generation of startups.
          </p>
        </div>

        <div className="flex gap-16 sm:gap-24 md:pr-12">
          
          <div className="flex flex-col gap-5">
            <Link 
              href="/ideas" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-base font-medium"
            >
              Ideas
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-base font-medium"
            >
              Categories
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <Link 
              href="/contact" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-base font-medium"
            >
              Contact Us
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors text-base font-medium"
            >
              Privacy Policy
            </Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
}