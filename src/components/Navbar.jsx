"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Menu, User, UserCircle, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle'; 
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Image from 'next/image';
import Logo from './../../public/asset/Logo.png'

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Ideas', href: '/ideas' },
    { name: 'Add Idea', href: '/add-idea' },
    { name: 'My Ideas', href: '/my-ideas' },
  ];

  return (
    <nav className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-1 sm:px-6 lg:px-12">
      <div className="flex items-center justify-between pt-1 pb-2">
        
        <Link 
          href="/" 
          className="flex items-center gap-2 text-blue-700 dark:text-blue-500 hover:opacity-90 transition-opacity"
        >
          <Image src={Logo} alt='logo'></Image>
        </Link>

        <ul className="hidden md:flex items-center h-full gap-6 lg:gap-10 text-gray-600 dark:text-gray-300 font-medium text-base lg:text-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li 
                key={link.href} 
                className={`h-full flex items-center transition-colors border-b-[3px] pt-[3px] ${
                  isActive 
                    ? 'text-blue-700 dark:text-blue-500 border-blue-700 dark:border-blue-500' 
                    : 'border-transparent hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 sm:gap-6">
          
          <ThemeToggle />
{/* avatar profile */}
          <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full"><Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar></Button>} />
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

        <div className="flex ">
            <Button className="rounded-full">Login/Register <UserCircle/></Button>
            
        </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 flex flex-col gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md font-medium text-base transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          {/* Mobile-only Login/Register Button */}
          <div className="pt-2 sm:hidden">
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-md font-medium text-sm transition-colors">
              Login/Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}