import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
const inter = Inter({
  
  subsets: ["latin"],
  display: 'swap',
})
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: {
    default: "IdeaVault | Vault of Next-Gen Concepts",
    template: "%s | IdeaVault",
  },
  description: "Discover, share, and collaborate on innovative next-gen ideas.",
};

export default function RootLayout({ children }) {
  return (
    // 1. You MUST add suppressHydrationWarning here for next-themes
    <html lang="en" suppressHydrationWarning>
      
      {/* 2. Keep this one here as well to protect against browser extensions */}
      <body 
        // 2. Inject inter.className alongside your existing classes
        className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-300`}
        suppressHydrationWarning 
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" 
          enableSystem={false} 
          disableTransitionOnChange
        >
          <Navbar /> 
          
          <main>
            {children}
          </main>
          <Footer/>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
