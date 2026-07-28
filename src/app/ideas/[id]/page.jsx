import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Wallet, 
  ThumbsUp, 
  Bookmark, 
  MoreVertical,
  Plus
} from 'lucide-react';
import Image from 'next/image';


export default async function IdeaDetailsPage({params}) {
    const { id } = await params;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}`);
    const idea = await res.json();
    const {project} = idea;
      const primaryBadge = project.badges[0];
      const secondBadge = project.badges[1];

    const getBadgeColor = (badgeText) => {
        const text = badgeText?.toUpperCase() || "";
        if (text.includes("AI") || text.includes("EDTECH")) return "bg-green-100 text-green-700";
        if (text.includes("HEALTH")) return "bg-orange-100 text-orange-700";
        if (text.includes("FINTECH") || text.includes("SAAS")) return "bg-blue-100 text-blue-700";
        return "bg-gray-100 text-gray-700";
};
//   console.log("Fetched Idea:", idea); // Debugging line to check the fetched idea data
    const coverimg = idea?.project?.cover_image
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      
       <Image 
       className="w-full h-48 md:h-72 lg:h-80 rounded-2xl md:rounded-3xl bg-gray-200 mb-8 md:mb-12 bg-cover bg-center shadow-sm border border-gray-100 dark:border-gray-800"
        src={coverimg }
        height={320}
        width={1280}
        alt={project?.title || "Idea Cover Image"}>

       </Image>
        


      <div className="mb-10">
        {/* Badges */}
        <div className="flex gap-2 mb-4">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(primaryBadge)}`}>
                {primaryBadge}
          
            </span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(primaryBadge)}`}>
                {secondBadge}
          
            </span>
        </div>
        
        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
            {idea?.project?.title || "Untitled Idea"}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-8">
          An AI-driven platform that anticipates customer churn by analyzing engagement metrics and automatically deploying personalized retention campaigns.
        </p>

        {/* Author & Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Author */}
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Sarah Jenkins</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Product Lead • Oct 24, 2024</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <ThumbsUp className="w-4 h-4" /> 124
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <Bookmark className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Detail Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* The Problem */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">The Problem</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              SaaS companies lose an average of 5-7% of their customer base annually due to preventable churn. Current Customer Success (CS) teams rely on reactive indicators (support tickets, usage drops) that often surface too late. The manual effort required to analyze disparate data streams (login frequency, feature usage, NPS scores, billing history) means CS managers can only proactively manage top-tier accounts, leaving the long-tail vulnerable.
            </p>
          </div>

          {/* The Solution */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">The Solution</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              A predictive analytics engine that ingests product telemetry, CRM data, and support interactions to calculate a real-time 'Health Score' for every user. When a user's score drops below a dynamic threshold, the system automatically triggers targeted interventions via email or in-app messaging, or escalates high-value accounts to human CS reps with suggested talking points based on the specific risk factors identified.
            </p>
            <ul className="space-y-2 pl-6">
              <li className="text-sm text-gray-600 dark:text-gray-300 list-disc marker:text-gray-400">
                Real-time telemetry ingestion via API
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-300 list-disc marker:text-gray-400">
                Machine Learning models trained on historical churn data
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-300 list-disc marker:text-gray-400">
                Automated playbook execution (email, slack, in-app)
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-300 list-disc marker:text-gray-400">
                CS Rep Dashboard prioritizing "At-Risk" MRR
              </li>
            </ul>
          </div>

          {/* Audience & Budget Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Target Audience</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Mid-market to Enterprise B2B SaaS companies (100-1000 employees) with dedicated Customer Success teams looking to scale their operations without linear headcount growth.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Budget Required</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-800 dark:text-gray-200">$150k - $250k for Initial MVP.</span> Breakdown: Data Engineering (40%), ML Model Dev (30%), Frontend/Integration (30%).
              </p>
            </div>
          </div>

          <hr className="my-10 border-gray-200 dark:border-gray-800" />

          {/* Discussion Section */}
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Discussion (2)</h3>
            
            {/* Input Area */}
            <div className="flex gap-4 mb-8">
              <img src="https://i.pravatar.cc/150?img=47" alt="You" className="w-10 h-10 rounded-full border border-gray-200 hidden sm:block" />
              <div className="flex-1 flex flex-col items-end gap-3">
                <textarea 
                  placeholder="Add a comment or feedback..."
                  className="w-full bg-[#f8fafc] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                ></textarea>
                <button className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm">
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              
              {/* Comment 1 */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4">
                <img src="https://i.pravatar.cc/150?u=david" alt="David Chen" className="w-10 h-10 rounded-full border border-gray-200" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white mr-2">David Chen</span>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    This is a solid premise, but I worry about the data ingestion piece. Connecting to legacy CRMs might eat up more than 40% of the engineering budget. Have you considered partnering with an integration platform like Segment initially?
                  </p>
                  <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                    Reply
                  </button>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4">
                <img src="https://i.pravatar.cc/150?u=elena" alt="Elena Rodriguez" className="w-10 h-10 rounded-full border border-gray-200" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white mr-2">Elena Rodriguez</span>
                      <span className="text-xs text-gray-400">5 hours ago</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    I love the focus on the long-tail customers. That's usually where the most silent churn happens. Are you planning to include sentiment analysis from support tickets in the Health Score?
                  </p>
                  <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                    Reply
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Metadata Cards */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status */}
          <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status</h4>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-base font-bold text-gray-900 dark:text-white">Validation Phase</span>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="p-5 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</h4>
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                SaaS / Enterprise
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">Artificial Intelligence</span>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">Predictive Analytics</span>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">Customer Success</span>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">B2B</span>
              </div>
            </div>
          </div>

          {/* Collaborators */}
          <div className="p-5 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Active Collaborators</h4>
             <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/150?u=collab1" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                <img src="https://i.pravatar.cc/150?u=collab2" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                <img src="https://i.pravatar.cc/150?u=collab3" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 bg-white dark:bg-gray-800 z-10 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}