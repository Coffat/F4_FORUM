"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Target,
  Globe,
  Building2,
  CheckCircle2,
  ArrowRight,
  Search,
  Shield,
  Users,
  Award,
  BookOpen,
  Mail,
  Smartphone,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { name: "Courses", href: "/#courses" },
  { name: "Schedule", href: "#" },
  { name: "Resources", href: "#" },
  { name: "Community", href: "#" },
  { name: "About Us", href: "/about" },
];

const STATS = [
  { label: "ALUMNI PUBLISHED", value: "2.4k" },
  { label: "MASTERY RETENTION", value: "98%" },
];

const F4_METHOD = [
  {
    title: "Curated Rigor",
    description: "We bypass the generic. Our curriculum is built from high-density academic papers, legal frameworks, and contemporary literature to ensure your vocabulary is as precise as your intent.",
    icon: <BookOpen className="w-5 h-5 text-blue-600" />,
    className: "bg-white",
    iconBg: "bg-blue-50",
  },
  {
    title: "Modern Pedagogy",
    description: "Leveraging spaced repetition and active recall models specifically tuned for adult neuroplasticity.",
    icon: <Zap className="w-5 h-5 text-white" />,
    className: "bg-indigo-600 text-white",
    iconBg: "bg-white/20",
    descriptionColor: "text-indigo-100",
  },
  {
    title: "Peer Elite",
    description: "You learn among peers. Our focus is restricted to high-achieving individuals, fostering a network that extends far beyond the classroom.",
    icon: <Users className="w-5 h-5 text-blue-600" />,
    className: "bg-slate-50",
    iconBg: "bg-white",
    showAvatars: true,
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
            key={item.name}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              item.name === "About Us" ? "text-blue-700" : "text-slate-600 hover:text-blue-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
          Login
        </Link>
        <Link
          href="/enroll"
          className="bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-800 transition-all shadow-md shadow-blue-200"
        >
          Enroll Now
        </Link>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Background Image Container */}
    <div className="absolute inset-0 z-0">
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=80"
        alt="Office background"
        fill
        className="object-cover opacity-10"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="max-w-2xl">
        <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mb-6">
          THE ACADEMIC CURATOR
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
          The F4 Philosophy: <br />
          <span className="text-slate-500">Fast, Focus, Future, Foundation.</span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
          Redefining the architecture of English language mastery through curated rigor and intentional depth.
        </p>
      </div>

      {/* Floating Card */}
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50">
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Precision Learning</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Every minute mapped to a cognitive milestone.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Elite Pedagogy</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Methods refined by leaders in school and data science.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const JourneySection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="aspect-[4/5] relative rounded-[2.5rem] overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop&q=80"
            alt="Our Journey"
            fill
            className="object-cover"
          />
        </div>
        {/* Years Badge */}
        <div className="absolute -bottom-6 -right-6 lg:right-4 bg-blue-700 text-white p-8 rounded-[2rem] shadow-xl max-w-[200px]">
          <p className="text-4xl font-black mb-1">10+</p>
          <p className="text-[10px] font-bold uppercase tracking-wider leading-tight opacity-80">
            YEARS OF ACADEMIC EVOLUTION
          </p>
        </div>
      </div>

      <div className="lg:pl-8">
        <h2 className="text-4xl font-black text-slate-900 mb-8">Our Journey</h2>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            Founded at the intersection of traditional academia and digital innovation, F4 Forum began as an experimental boutique lab. We questioned why high-level language proficiency was so often elusive despite years of study.
          </p>
          <p>
            Today, we stand as the premier destination for students who demand more than "conversational" English. We build the foundations required for global leadership, academic publishing, and sophisticated discourse.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 mt-12 pt-12 border-t border-slate-100">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const MethodSection = () => (
  <section className="py-24 bg-slate-50/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">The F4 Method</h2>
        <p className="text-slate-500 leading-relaxed">
          A multi-layered cognitive framework designed for accelerated fluency and intellectual weight.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Curated Rigor */}
        <div className={`p-8 rounded-[2rem] shadow-sm border border-slate-100 ${F4_METHOD[0].className}`}>
          <div className={`w-12 h-12 rounded-2xl ${F4_METHOD[0].iconBg} flex items-center justify-center mb-12`}>
            {F4_METHOD[0].icon}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">{F4_METHOD[0].title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{F4_METHOD[0].description}</p>
        </div>

        {/* Small Image Card */}
        <div className="relative rounded-[2rem] overflow-hidden aspect-square md:aspect-auto">
          <Image
            src="https://images.unsplash.com/photo-1454165833767-027508496b4c?w=600&auto=format&fit=crop&q=80"
            alt="Method detail"
            fill
            className="object-cover"
          />
        </div>

        {/* Modern Pedagogy */}
        <div className={`p-8 rounded-[2rem] shadow-xl ${F4_METHOD[1].className}`}>
          <div className={`w-12 h-12 rounded-2xl ${F4_METHOD[1].iconBg} flex items-center justify-center mb-12`}>
            {F4_METHOD[1].icon}
          </div>
          <h3 className="text-xl font-bold mb-4">{F4_METHOD[1].title}</h3>
          <p className={`${F4_METHOD[1].descriptionColor} text-sm leading-relaxed`}>
            {F4_METHOD[1].description}
          </p>
        </div>

        {/* Peer Elite */}
        <div className={`p-8 rounded-[2rem] shadow-sm border border-slate-100 ${F4_METHOD[2].className}`}>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            {F4_METHOD[2].description}
          </p>
          <div className="flex -space-x-3 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                <Image
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="Avatar"
                  width={40}
                  height={40}
                />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
              +10
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{F4_METHOD[2].title}</h3>
        </div>

        {/* Collaborative Intelligence - Large Card */}
        <div className="lg:col-span-2 relative rounded-[2rem] overflow-hidden min-h-[300px] flex items-end">
          <Image
            src="https://images.unsplash.com/photo-1522071823991-b9676552b9ae?w=1000&auto=format&fit=crop&q=80"
            alt="Collaborative Intelligence"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="relative p-8 w-full">
            <h3 className="text-2xl font-bold text-white mb-2">Collaborative Intelligence</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const IntegritySection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-6">
      <div className="bg-slate-50 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
        {/* Watermark Icon */}
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-[0.03]">
          <Shield className="w-80 h-80 text-slate-900" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Academic Integrity</h2>
            <p className="text-blue-600 font-bold mb-6 italic">
              "Truth in articulation is the foundation of character."
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              At F4 Forum, we uphold the highest standards of linguistic honesty. We discourage shortcuts, AI only generation without comprehension, and passive learning. Our certification represents a verifiable level of original thought and expression.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Original Intellectual Output",
              "Peer Review Accountability",
              "Evidence-Based Assessment",
              "Ethical Discourse Training",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-800 font-semibold text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="bg-blue-700 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 max-w-2xl mx-auto leading-tight">
            Ready to build your academic foundation?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/enroll"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-full hover:bg-slate-50 transition-all shadow-xl"
            >
              Enroll in the Next Forum
            </Link>
            <Link
              href="/advisor"
              className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              Speak with an Academic Advisor
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-50 py-12 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
            <span className="text-white text-[8px] font-black">F4</span>
          </div>
          <span className="text-slate-900 font-bold text-sm">F4 Forum</span>
        </div>
        <p className="text-slate-400 text-xs">© 2026 F4 Forum, The Academic Curator</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-blue-600 transition-colors">Contact Support</Link>
        <Link href="/about" className="text-blue-600">About Us</Link>
      </div>
    </div>
  </footer>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <JourneySection />
      <MethodSection />
      <IntegritySection />
      <CTASection />
      <Footer />
    </main>
  );
}
