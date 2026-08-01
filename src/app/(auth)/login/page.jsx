"use client";
import React from "react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@base-ui/react/button";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
// import React from 'react';

export default function LoginPage() {
  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log(e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const loginData = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      ...loginData,
    });
    if (!error) {
      toast.success("Login successful!");
    }
    if (error) {
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <AuthLayout activeTab="login">
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 font-mono">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-shadow"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700 font-mono">
              Password
            </label>
            <a
              href="#"
              className="text-xs font-bold text-[#0052cc] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-shadow"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="cursor-pointer w-full py-3 px-4 bg-[#0052cc] hover:bg-blue-800 text-white font-bold rounded-lg transition-colors mt-2"
        >
          Log In
        </Button>
      </form>
      {/* Divider */}
      <div className="relative flex items-center py-4 my-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Or continue with
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Google Button */}
      <Button
        onClick={signIn}
        type="button"
        className="cursor-pointer w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {/* Standard Google SVG Icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </Button>
    </AuthLayout>
  );
}
