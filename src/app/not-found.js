import React from "react";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import Image from "next/image";
import rocket from "@/lib/rocket.jpg";

export const metadata = {
  title: "404 Not Found | IdeaVault",
  description: "The page or idea you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen  flex flex-col items-center justify-center px-6 py-12 font-sans">
      
      {/* Top Graphic Image */}
      <div className="max-w-2xl w-full mb-12 rounded-xl overflow-hidden shadow-2xl">
        
        <Image 
        src={rocket}
        alt="Rocket Launching"
        width={800}
        height={400}
        className="w-full h-auto object-cover"
        priority
        
        />
      </div>

      {/* Headline */}
      <h1 className="text-2xl md:text-[32px] font-bold text-[#1e3a8a] text-center max-w-2xl mb-6 leading-snug tracking-tight">
        Oops! This innovation hasn't been <br className="hidden md:block" />
        discovered yet.
      </h1>

      {/* Subheadline */}
      <p className="text-gray-500 text-center max-w-xl text-[15px] md:text-base mb-12 leading-relaxed">
        It looks like you've ventured into uncharted territory. The idea or page you are looking for is missing, off course, or currently in stealth mode.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        
        <Link href="/" className="w-full sm:w-auto ">
          <button className="cursor-pointer flex items-center justify-center gap-2 bg-[#0062ff] hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full shadow-sm text-sm">
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </Link>

        <Link href="/ideas" className="w-full sm:w-auto">
          <button className="cursor-pointer flex items-center justify-center gap-2 bg-transparent border border-gray-700 hover:bg-blue-700 hover:text-white text-[#0062ff] px-6 py-3 rounded-lg font-medium transition-colors w-full text-sm">
            <Search className="w-4 h-4" />
            Search Ideas
          </button>
        </Link>
        
      </div>
      
    </main>
  );
}