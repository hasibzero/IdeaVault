"use client";

import React, { useState } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Lightbulb, Menu, User, UserCircle, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import Logo from "./../../public/asset/Logo.png";
import { authClient } from "@/lib/auth-client";

// import { router } from "better-auth/api";
// import { revalidatePath } from "next/cache";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  console.log("Session data:", session); // Log the session data to see its structure
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Ideas", href: "/ideas" },
    { name: "Add Idea", href: "/ideas/new" },
    { name: "My Ideas", href: "/my-ideas" },
    // --- COMMENTS & INTERACTIONS (UPDATED CODE) ---
    { name: "My Interactions", href: "/my-interactions" },
    // --- END OF COMMENTS & INTERACTIONS (UPDATED CODE) ---
  ];
  const router = useRouter();
  const handleLogout = async () => {
    // "use server";
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // Redirect to login page after logout
          // revalidatePath("/"); // Revalidate the home page after logout
          // redirect("/login")// redirect to login page
        },
      },
    });
  };

  return (
    <nav className="relative z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-1 sm:px-6 lg:px-12 ">
      <div className="flex items-center justify-between pt-1 pb-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-700 dark:text-blue-500 hover:opacity-90 transition-opacity"
        >
          <Image src={Logo} alt="logo"></Image>
        </Link>

        <ul className="hidden md:flex items-center h-full gap-6 lg:gap-10 text-gray-600 dark:text-gray-300 font-medium text-base lg:text-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li
                key={link.href}
                className={`h-full flex items-center transition-colors border-b-[3px] pt-[3px] ${
                  isActive
                    ? "text-blue-700 dark:text-blue-500 border-blue-700 dark:border-blue-500"
                    : "border-transparent hover:text-gray-900 dark:hover:text-white"
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

          {!isPending && !session ? (
            <>
              <Link href="/login">
                <div className="flex cursor-pointer">
                  <Button
                    variant="login"
                    className="items-center gap-2 rounded-lg"
                  >
                    Login/Register <UserCircle />
                  </Button>
                </div>
              </Link>
            </>
          ) : (
            <>
              <DropdownMenu className="cursor-pointer">
                <DropdownMenuTrigger className="rounded-full outline-none focus:outline-none">
                  <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage
                      src={session?.user.image}
                      alt={session?.user.name}
                    />
                    <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32 ">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/profile" className="flex items-center gap-2"> 
                      Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="hidden md:inline-flex">Hi, {session?.user.name}</p>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 pointer-events-none" />
            ) : (
              <Menu className="w-7 h-7 pointer-events-none" />
            )}
          </button>
        </div>
      </div>

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
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
