
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './../../public/asset/Logo.png'


export default function AuthLayout({ children, activeTab = 'login' }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between bg-gradient-to-br from-[#cce5ff] via-[#dcf5e7] to-[#bdf5d3]">
          
          <div>
            <h1 className="text-4xl font-extrabold text-[#0052cc] tracking-tight mb-3">
              <Image src={Logo} alt='logo'></Image>
            </h1>
            <p className="text-gray-700 text-lg font-medium">
              Fueling the next generation of startups.
            </p>
          </div>

          <div className="mt-16 md:mt-24">
            <blockquote className="text-[22px] font-bold text-[#0f172a] leading-snug mb-6">
              "The structured creativity I needed to turn scattered thoughts into a viable SaaS product."
            </blockquote>
            
            <div className="flex items-center gap-4">
              <img 
                src="https://i.pravatar.cc/150?u=sarah" 
                alt="Sarah J." 
                className="w-12 h-12 rounded-full ring-2 ring-white object-cover"
              />
              <div>
                <p className="text-sm font-extrabold text-gray-900">Sarah J.</p>
                <p className="text-xs text-gray-600 font-medium">Founder, SyncFlow</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col bg-white">
          
          <div className="flex border-b border-gray-200 mb-8">
            <Link 
              href="/login" 
              className={`pb-3 text-xl font-bold mr-6 transition-colors relative ${
                activeTab === 'login' 
                  ? 'text-[#0052cc] border-b-2 border-[#0052cc]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Log In
            </Link>
            <Link 
              href="/register" 
              className={`pb-3 text-xl font-bold transition-colors relative ${
                activeTab === 'register' 
                  ? 'text-[#0052cc] border-b-2 border-[#0052cc]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </Link>
          </div>

          <div className="flex-1">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}