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

export default function TrendingIdeas() {
  return (
    <section className="w-full px-6 lg:px-12 py-16 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight mb-2">
            Trending Ideas
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
            The most active concepts bubbling up from the community.
          </p>
        </div>
        
        {/* View All Button */}
        <Button variant="outline" className="cursor-pointer rounded-full px-6 border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Grid Container (Ready for more cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Idea Card 1 */}
        <Card className="flex flex-col rounded-2xl shadow-sm border-gray-200 dark:border-gray-800">
          
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            {/* Tag */}
            <div className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-xs font-bold rounded-full tracking-wide">
              AI & ML
            </div>
            
            {/* Avatar Group */}
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                src="https://i.pravatar.cc/150?img=32"
                alt="Contributor 1"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                src="https://i.pravatar.cc/150?img=12"
                alt="Contributor 2"
              />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1">
            <CardTitle className="text-xl font-bold text-[#0f172a] dark:text-white mb-3 leading-snug">
              AI-Powered Waste Management
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Smart sorting facilities using computer vision to dramatically increase recycling efficiency in urban centers.
            </p>
          </CardContent>
          
          <CardFooter>
            <Button variant="outline" className="cursor-pointer w-full rounded-lg font-semibold text-gray-700 dark:text-gray-300">
              View Details
            </Button>
          </CardFooter>
          
        </Card>

      </div>
    </section>
  );
}