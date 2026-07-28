import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeaturedIdeasPage from './FeaturedIdeas';

export default function TrendingIdeas() {
  return (
    <section className="w-full px-6 lg:px-20 pt-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-2">
            Trending Ideas
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
            The most active concepts bubbling up from the community.
          </p>
        </div>
        
        <Button variant="outline" className="cursor-pointer rounded-full px-6 border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        
      </div>
      <FeaturedIdeasPage/>

      
    </section>
  );
}