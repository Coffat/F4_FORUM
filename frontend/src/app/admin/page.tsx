import { CheckCircle2, MoreVertical, Search, ArrowUpRight, TrendingUp, ChevronRight, UserPlus, Download, BarChart2, Megaphone } from "lucide-react";
import Image from "next/image";

const CARDS = [
  {
    title: "TOTAL STUDENTS",
    value: "2,450",
    trend: "+12%",
    trendColor: "text-green-500",
    trendIcon: TrendingUp,
  },
  {
    title: "ACTIVE COURSES",
    value: "42",
    trend: "Current",
    trendColor: "text-blue-600",
    trendIcon: BookOpenIcon,
  },
  {
    title: "TOTAL REVENUE",
    value: "$48k",
    trend: "+$4.2k",
    trendColor: "text-green-500",
    trendIcon: ArrowUpRight,
  },
  {
    title: "AVERAGE MASTERY",
    value: "92%",
    trend: "Excellence",
    trendColor: "text-purple-600",
    trendIcon: AwardIcon,
  },
];

const STAFF_STATS = [
  { name: "IELTS Specialists", count: 8, percent: 80, color: "bg-purple-600", bgTrack: "bg-purple-100" },
  { name: "Business English", count: 6, percent: 60, color: "bg-purple-600", bgTrack: "bg-purple-100" },
  { name: "General Curriculum", count: 7, percent: 70, color: "bg-blue-600", bgTrack: "bg-blue-100" },
  { name: "Admissions & Ops", count: 3, percent: 30, color: "bg-purple-600", bgTrack: "bg-purple-100" },
];

const RECENT_ACTIVITY = [
  {
    user: "Sarah Jenkins",
    action: "enrolled in",
    target: "Advanced IELTS Writing",
    time: "2 minutes ago",
    type: "new_student",
    avatar: "https://i.pravatar.cc/150?img=1",
    icon: UserPlus,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    user: "Michael Chen",
    action: "completed",
    target: "Business English Foundations",
    time: "15 minutes ago",
    type: "completion",
    avatar: "https://i.pravatar.cc/150?img=11",
    icon: CheckCircle2,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    user: "Elena Rodriguez",
    action: "enrolled in",
    target: "Cambridge Proficiency Prep",
    time: "1 hour ago",
    type: "new_student",
    avatar: "https://i.pravatar.cc/150?img=5",
    icon: UserPlus,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    user: "David Park",
    action: "completed",
    target: "Spoken English Level 4",
    time: "3 hours ago",
    type: "completion",
    avatar: "https://i.pravatar.cc/150?img=15",
    icon: CheckCircle2,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

// Helper icons for cards
function BookOpenIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v-2H6.5a.5.5 0 0 0 0 1H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13ZM4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z" />
    </svg>
  );
}

function AwardIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.756a8.55 8.55 0 0 1-1.396 4.706C2.864 16.035 2.375 18.064 3.75 19.5a14.73 14.73 0 0 0 5.174 3c1.947.65 4.199.65 6.146 0a14.73 14.73 0 0 0 5.174-3c1.375-1.436.886-3.465-.104-5.044a8.55 8.55 0 0 1-1.396-4.706V9A6.75 6.75 0 0 0 12 2.25ZM9.75 9a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" clipRule="evenodd" />
    </svg>
  );
}


export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Institutional Overview</h2>
        <p className="text-slate-500 mt-1 font-medium">Real-time performance metrics and curriculum distribution for F4 Forum.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, idx) => {
          const TrendIcon = card.trendIcon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 mb-4">{card.title}</p>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-[#0B3A9A] tracking-tight">{card.value}</span>
                <div className={`flex items-center gap-1 ${card.trendColor} font-bold text-xs bg-${card.trendColor.split('-')[1]}-50 px-2 py-1 rounded-md`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                  {card.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Popularity & Recent Activity (Column 1 and 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Course Popularity Placeholder */}
          <div className="bg-[#F8F9FA] rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Course Popularity</h3>
                <p className="text-xs text-slate-500 mt-1">Enrollment volume by program category</p>
              </div>
              <button className="text-blue-600 text-xs font-bold flex items-center gap-1 uppercase tracking-wider hover:underline">
                View Full Report <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-end relative">
                {/* Simplified Chart visualization */}
                <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 pt-4">
                  {/* Bars placeholder */}
                   <div className="w-16 bg-[#E2E8F0] rounded-t-sm h-[40%]"></div>
                   <div className="w-16 bg-[#E2E8F0] rounded-t-sm h-[60%]"></div>
                   <div className="w-16 bg-[#E2E8F0] rounded-t-sm h-[80%]"></div>
                   <div className="w-16 bg-[#E2E8F0] rounded-t-sm h-[30%]"></div>
                   <div className="w-16 bg-[#E2E8F0] rounded-t-sm h-[50%]"></div>
                </div>
                
                {/* X Axis Labels */}
                <div className="flex justify-between px-8 pt-2 mt-auto border-t border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                    <span>IELTS</span>
                    <span>BUSINESS</span>
                    <span>GENERAL</span>
                    <span>ACADEMIC</span>
                    <span>TOEFL</span>
                </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {RECENT_ACTIVITY.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.iconBg}`}>
                     <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-blue-700">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                  {activity.type === 'new_student' ? (
                      <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap">
                          New Student
                      </span>
                  ) : (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md whitespace-nowrap">
                          Completion
                      </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Staff Overview & Curator's Hub (Column 3) */}
        <div className="space-y-6">
          
          {/* Staff Overview */}
          <div className="bg-[#EBECEF] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Staff Overview</h3>
              <span className="text-xs font-bold text-blue-600 tracking-wider">24 TOTAL</span>
            </div>
            
            <div className="space-y-5">
              {STAFF_STATS.map((stat) => (
                <div key={stat.name}>
                  <div className="flex justify-between text-sm font-medium text-slate-800 mb-2">
                    <span>{stat.name}</span>
                    <span className="font-bold">{stat.count}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${stat.bgTrack}`}>
                    <div 
                      className={`h-full rounded-full ${stat.color}`}
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-300">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3">Lead Instructors</p>
              <div className="flex -space-x-3">
                 {[4, 8, 12].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#EBECEF] bg-slate-200 overflow-hidden">
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i}`}
                      alt="Instructor"
                      width={40}
                      height={40}
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#EBECEF] bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  +21
                </div>
              </div>
            </div>
          </div>

          {/* Curator's Hub Action Card */}
          <div className="bg-[#0B3A9A] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
            <h3 className="text-xl font-bold mb-2">Curator's Hub</h3>
            <p className="text-blue-200 text-sm mb-6 leading-relaxed">
              Manage platform-wide settings and academic standards.
            </p>
            
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-3 px-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                Generate Revenue Report
                <Download className="w-4 h-4" />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-3 px-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                Audit Course Content
                <BarChart2 className="w-4 h-4" />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-3 px-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10 text-center">
                <span className="flex-1 text-center">Broadcast Announcement</span>
                <Megaphone className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
