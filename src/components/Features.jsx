import React from 'react';
import { Users, BadgeCheck, TrendingUp } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Users,
      iconBg: "bg-blue-600",
      iconColor: "text-white",
      title: "Collective Intelligence",
      description: "Tap into a network of visionaries. Collaborate seamlessly to refine concepts and uncover blind spots."
    },
    {
      icon: BadgeCheck,
      iconBg: "bg-emerald-300", 
      iconColor: "text-emerald-950",
      title: "Rigorous Validation",
      description: "Move beyond gut feelings. Utilize our structured frameworks to test viability before writing a single line of code."
    },
    {
      icon: TrendingUp,
      iconBg: "bg-amber-600",
      iconColor: "text-white",
      title: "Accelerated Growth",
      description: "Connect validated ideas with the right resources, talent, and capital to build the future, faster."
    }
  ];

  return (
    // The section background automatically switches based on the theme
    <section className="w-full px-6 lg:px-12 py-20 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Text */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 dark:text-blue-500 mb-4 tracking-tight">
            Why IdeaVault?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Structured for clarity. Built for momentum.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-300 dark:border-gray-800 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300"
              >
                {/* Icon Wrapper */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${feature.iconBg} ${feature.iconColor}`}>
                  <Icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
                
                {/* Text Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}