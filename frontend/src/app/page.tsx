import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Target,
  Globe,
  Building2,
  Star,
  ArrowRight,
  Plus,
  CheckCircle2,
  Search,
  ChevronRight,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Courses", "Schedule", "Community", "Instructors"];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    title: "Fast",
    description:
      "Accelerated learning cycles designed to maximize results in less time.",
  },
  {
    icon: <Target className="w-6 h-6 text-orange-500" />,
    title: "Focus",
    description:
      "Deep-work methodologies that sharpen language acquisition and productivity.",
  },
  {
    icon: <Globe className="w-6 h-6 text-green-500" />,
    title: "Future",
    description:
      "Skills calibrated for the global engineering and professional landscape.",
  },
  {
    icon: <Building2 className="w-6 h-6 text-purple-500" />,
    title: "Foundation",
    description:
      "Solid roots. Structure. Keeping the very best in a lifetime of communication.",
  },
];

const COURSES = [
  {
    tag: "ACADEMIC",
    level: "ADVANCED",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    title: "Academic Writing",
    description:
      "Master the art of scholarly writing - arguments, research papers, fit for your educational goals.",
    price: "$499",
    badge: null,
  },
  {
    tag: "BUSINESS",
    level: "INTERMEDIATE",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=80",
    title: "Business English",
    description:
      "Elevate professional communication, negotiations, teamwork and international corporate etiquette.",
    price: "$549",
    badge: "HOT",
  },
  {
    tag: "EXAM",
    level: "INTENSIVE",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Mastery",
    description:
      "Targeted exam training to achieve a Band 8+ score through precision study.",
    price: "$620",
    badge: "POPULAR",
  },
];

const PARTNERS = ["CAMBRIDGE", "OXFORD UNI", "BRITISH COUNCIL", "ETS GLOBAL"];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "\"This methodology completely changed how I approach professional dialects. It wasn't just about grammar; it was about the foundation of logical communication.\"",
    name: "Alexandra Chen",
    role: "Lead Consultant, University",
    avatar: "AC",
    color: "bg-blue-600",
  },
  {
    stars: 5,
    text: "\"F4 Forum provides an optimal hook to learning. It feels like you're part of an elite think tank. My IELTS score improved from 6.5 to 8.5 in less than 3 months.\"",
    name: "Diana Rodriguez",
    role: "Head Marketing, TechFlow",
    avatar: "DR",
    color: "bg-purple-600",
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
          <span className="text-white text-xs font-black">F4</span>
        </div>
        <span className="text-slate-800 font-bold text-base tracking-tight">
          F4 Forum
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((item) => (
          <Link
            key={item}
            href="#"
            className="text-slate-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Search + CTA */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-2 text-sm text-slate-400">
          <Search className="w-4 h-4" />
          <span>Search...</span>
        </div>
        <Link
          href="/login"
          className="text-slate-700 text-sm font-semibold hover:text-blue-700 transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/login"
          className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-800 transition-colors shadow-md shadow-blue-200"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
    {/* Background image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&auto=format&fit=crop&q=80')",
      }}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/20" />

    <div className="relative max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl">
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6">
          Premium English Learning
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Fast, Focus, Future,{" "}
          <span className="text-blue-400 italic">Foundation.</span>
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-xl">
          An English center for the modern intellect. We recruit high-achievers
          and equip them with academic language and real-world professional
          excellence.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#courses"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            Explore Courses
          </Link>
          <Link
            href="#instructors"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all"
          >
            Meet the Instructors
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-3 p-6 rounded-2xl hover:bg-slate-50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CoursesSection = () => (
  <section id="courses" className="bg-slate-50 py-20">
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Curated Learning Paths
          </h2>
          <p className="text-slate-500 mt-1">
            Our most sought-after programs for academic and professional success.
          </p>
        </div>
        <Link
          href="#"
          className="hidden md:flex items-center gap-1 text-blue-700 font-bold text-sm hover:underline"
        >
          View all programs <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COURSES.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                  {c.tag}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-white">
                  {c.level}
                </span>
              </div>
              {c.badge && (
                <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500 text-white">
                  {c.badge}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {c.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {c.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-2xl font-black text-slate-800">
                  {c.price}
                </span>
                <button className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CommunitySection = () => (
  <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Image card */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden h-80 md:h-96">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
              alt="Community study"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent" />
          </div>
          {/* Floating card */}
          <div className="absolute bottom-6 left-6 right-6 bg-blue-700 text-white p-5 rounded-2xl shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
              Join Now
            </p>
            <p className="font-bold text-lg leading-tight">
              Foundation Workshop: Global Dialects
            </p>
          </div>
        </div>

        {/* Right: Text */}
        <div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">
            The Community
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-4">
            Focus & Foundation: The Collaborative Pulse
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Learning isn&apos;t a solitary journey at F4 Forum. We cultivate a
            high-trust environment where peers challenge peers. Our
            &quot;Academic Curator&quot; experience ensures every interaction is
            meaningful, building your linguistic foundation through real-world
            focus.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Peer-to-Peer Reviews",
              "Cultural Synergy Rides",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-blue-700 font-bold hover:underline"
          >
            Explore the Community <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const PartnersSection = () => (
  <section className="bg-slate-50 py-14 border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-10">
        Partnership with Excellence
      </p>
      <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
        {PARTNERS.map((p) => (
          <span
            key={p}
            className="text-slate-400 font-black text-sm tracking-widest uppercase hover:text-slate-600 transition-colors cursor-pointer"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:shadow-md transition-shadow"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-700 leading-relaxed text-sm mb-6">
              {t.text}
            </p>
            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-sm`}
              >
                {t.avatar}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                <p className="text-slate-400 text-xs">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white text-[10px] font-black">F4</span>
        </div>
        <span className="text-white font-bold text-sm">F4 Forum</span>
        <span className="text-xs ml-2">© 2026 F4 Forum — The Academic Curator</span>
      </div>
      <div className="flex gap-6 text-xs">
        {["Privacy Policy", "Terms of Service", "Contact Support", "About Us"].map(
          (item) => (
            <Link key={item} href="#" className="hover:text-white transition-colors">
              {item}
            </Link>
          )
        )}
      </div>
    </div>
  </footer>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <CommunitySection />
      <PartnersSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
