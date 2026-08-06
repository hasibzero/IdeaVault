import Features from "@/components/Features";
import Hero from "@/components/Hero";
import TrendingIdeas from "@/components/TrendingIdeas";
import Image from "next/image";

export const metadata = {
  title: "Home | IdeaVault",
  description: "Explore trending ideas, features, and community concepts on IdeaVault.",
};

export default function Home() {
  return (
    
    <div>
      <Hero/>
      <TrendingIdeas/>
      <Features/>

    </div>
  );
}
