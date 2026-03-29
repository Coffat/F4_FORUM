import Link from "next/link";
import Image from "next/image";
import {
  Search,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Course {
  id: string;
  tag: string;
  level: string;
  image: string;
  title: string;
  description: string;
  instructor: string;
  price: string;
  badge?: string;
  category: "academic" | "business" | "ielts" | "others";
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: "1",
    tag: "IELTS",
    level: "STARTER",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Foundation (3.0–4.0)",
    description:
      "Khởi đầu hành trình IELTS từ con số 0. Xây nền tảng vững chắc về ngữ pháp, từ vựng và kỹ năng cơ bản.",
    instructor: "Ms. Nguyễn Lan Anh",
    price: "3.800.000đ",
    badge: "BEGINNER",
    category: "ielts",
  },
  {
    id: "2",
    tag: "IELTS",
    level: "ELEMENTARY",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Elementary (4.0–5.0)",
    description:
      "Củng cố nền tảng và phát triển kỹ năng 4 trong 1. Bước đệm quan trọng trước khi chinh phục band 5.0.",
    instructor: "Mr. Trần Minh Quân",
    price: "4.200.000đ",
    category: "ielts",
  },
  {
    id: "3",
    tag: "IELTS",
    level: "PRE-INT",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Pre-Intermediate (5.0–5.5)",
    description:
      "Nâng cao kỹ năng nghe nói đọc viết, làm quen cấu trúc đề thi chính thức và thực hành chiến lược thi.",
    instructor: "Ms. Phạm Thu Hà",
    price: "4.800.000đ",
    badge: "POPULAR",
    category: "ielts",
  },
  {
    id: "4",
    tag: "IELTS",
    level: "INTERMEDIATE",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Intermediate – Đột Phá (5.5–6.0)",
    description:
      "Đột phá band 6.0 với chiến lược ôn thi chuyên sâu, mock test thực chiến và phản hồi cá nhân hóa.",
    instructor: "Mr. Lê Văn Đức",
    price: "5.500.000đ",
    badge: "HOT",
    category: "ielts",
  },
  {
    id: "5",
    tag: "IELTS",
    level: "UPPER-INT",
    image:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Upper-Intermediate (6.0–6.5)",
    description:
      "Tinh chỉnh từng kỹ năng, xử lý chuyên sâu Writing Task 2 & Speaking Part 3, hướng đến band 6.5.",
    instructor: "Ms. Vũ Thị Mai",
    price: "6.200.000đ",
    category: "ielts",
  },
  {
    id: "6",
    tag: "IELTS",
    level: "ADVANCED",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Advanced – Chinh Phục (6.5–7.0)",
    description:
      "Đẩy điểm từ 6.5 lên 7.0 với kỹ thuật nâng cao, phân tích bài thi IELTS Academic chuyên sâu.",
    instructor: "Mr. Trần Minh Quân",
    price: "7.200.000đ",
    badge: "BEST SELLER",
    category: "ielts",
  },
  {
    id: "7",
    tag: "IELTS",
    level: "HIGH-ADV",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Professional – Xuất Sắc (7.0–7.5)",
    description:
      "Lớp tinh anh dành cho học viên mục tiêu 7.5, luyện tập cùng cựu giám khảo IELTS Cambridge.",
    instructor: "Ms. Nguyễn Lan Anh",
    price: "8.500.000đ",
    badge: "PREMIUM",
    category: "ielts",
  },
  {
    id: "8",
    tag: "IELTS",
    level: "EXPERT",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80",
    title: "IELTS Expert – Đỉnh Cao (7.5–8.0+)",
    description:
      "Chinh phục band 8.0+ với lộ trình 1-1 cùng chuyên gia, phân tích sâu từng câu trả lời.",
    instructor: "Mr. Lê Văn Đức",
    price: "9.800.000đ",
    badge: "ELITE",
    category: "ielts",
  },
  {
    id: "9",
    tag: "ACADEMIC",
    level: "ADVANCED",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    title: "Academic Writing Mastery",
    description:
      "Thành thạo kỹ năng viết học thuật: luận văn, báo cáo nghiên cứu và bài luận phong cách Cambridge.",
    instructor: "Ms. Phạm Thu Hà",
    price: "4.999.000đ",
    category: "academic",
  },
  {
    id: "10",
    tag: "BUSINESS",
    level: "INTERMEDIATE",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=80",
    title: "Business English Elite",
    description:
      "Tiếng Anh thương mại thực chiến: đàm phán, thuyết trình, email và văn hóa doanh nghiệp quốc tế.",
    instructor: "Mr. Trần Minh Quân",
    price: "5.499.000đ",
    badge: "NEW",
    category: "business",
  },
];

const APPROACH_POINTS = [
  {
    icon: <BookOpen className="w-5 h-5 text-blue-600" />,
    title: "Curated Rigor",
    desc: "Chúng tôi không đưa ra 1000 khóa học; chỉ những lựa chọn đúng nhất, được tuyển chọn dành cho người học xuất sắc.",
  },
  {
    icon: <Award className="w-5 h-5 text-blue-600" />,
    title: "Modern Pedagogy",
    desc: "Giảng dạy lấy học viên làm trung tâm, kết hợp công nghệ kỹ thuật số và phương pháp giảng dạy hiện đại.",
  },
  {
    icon: <Users className="w-5 h-5 text-blue-600" />,
    title: "Peer Elite",
    desc: "Một cộng đồng của những học viên đỉnh cao, nuôi dưỡng sức mạnh tập thể và môi trường học tập xuất sắc.",
  },
];

const BADGE_COLORS: Record<string, string> = {
  "BEST SELLER": "bg-amber-500",
  HOT: "bg-rose-500",
  POPULAR: "bg-orange-500",
  PREMIUM: "bg-purple-600",
  ELITE: "bg-slate-800",
  NEW: "bg-green-500",
  BEGINNER: "bg-teal-500",
};

const LEVEL_COLORS: Record<string, string> = {
  STARTER: "bg-teal-600",
  ELEMENTARY: "bg-cyan-600",
  "PRE-INT": "bg-sky-600",
  INTERMEDIATE: "bg-blue-600",
  "UPPER-INT": "bg-indigo-600",
  ADVANCED: "bg-violet-700",
  "HIGH-ADV": "bg-purple-700",
  EXPERT: "bg-slate-800",
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
          <span className="text-white text-xs font-black">F4</span>
        </div>
        <span className="text-slate-800 font-bold text-base tracking-tight">F4 Forum</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {[
          { label: "Courses", href: "/courses" },
          { label: "Schedule", href: "#" },
          { label: "Community", href: "#" },
          { label: "Instructors", href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              item.label === "Courses"
                ? "text-blue-700 font-semibold"
                : "text-slate-600 hover:text-blue-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-slate-700 text-sm font-semibold hover:text-blue-700 transition-colors">
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

const CourseCard = ({ course }: { course: Course }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
    {/* Image */}
    <div className="relative h-44 overflow-hidden flex-shrink-0">
      <Image
        src={course.image}
        alt={course.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      {/* Tags */}
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-600 text-white uppercase tracking-wide">
          {course.tag}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full text-white uppercase tracking-wide ${
            LEVEL_COLORS[course.level] ?? "bg-slate-700"
          }`}
        >
          {course.level}
        </span>
      </div>
      {course.badge && (
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full text-white uppercase ${
            BADGE_COLORS[course.badge] ?? "bg-slate-700"
          }`}
        >
          {course.badge}
        </span>
      )}
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-slate-800 text-base leading-snug">{course.title}</h3>
        <span className="text-blue-700 font-black text-sm whitespace-nowrap">{course.price}</span>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed mb-3 flex-1">{course.description}</p>

      {/* Instructor */}
      <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
          {course.instructor.split(" ").pop()?.charAt(0)}
        </span>
        <span>{course.instructor}</span>
      </div>

      <Link
        href="/login"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5 shadow shadow-blue-200"
      >
        Enroll Now <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
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
        {["Privacy Policy", "Terms of Service", "Contact Support", "About Us"].map((item) => (
          <Link key={item} href="#" className="hover:text-white transition-colors">
            {item}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── Page Header ───────────────────────────────────────────── */}
      <section className="pt-28 pb-10 px-6 max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">
          The Academic Curator
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
          Explore Curated{" "}
          <span className="text-blue-600">Learning Paths</span>
        </h1>
        <p className="text-slate-500 mt-3 max-w-xl text-base leading-relaxed">
          A precision-crafted selection of English language programs designed
          for high-achieving students and global professionals.
        </p>
      </section>

      {/* ── Search + Filters ──────────────────────────────────────── */}
      <section className="px-6 max-w-7xl mx-auto mb-10">
        {/* Search bar */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="What would you like to master today?"
            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", active: true },
            { label: "Academic", active: false },
            { label: "Business", active: false },
            { label: "IELTS", active: false },
            { label: "Others", active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab.active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Course Cards Grid ─────────────────────────────────────── */}
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ── Academic Curator Approach ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left image */}
            <div className="relative rounded-3xl overflow-hidden h-80">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                alt="Academic curator approach"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
            </div>

            {/* Right text */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">
                The Methodology
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-6">
                The Academic Curator Approach
              </h2>
              <ul className="space-y-5">
                {APPROACH_POINTS.map((point) => (
                  <li key={point.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {point.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 mb-0.5">{point.title}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{point.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className="inline-flex items-center gap-2 mt-8 text-blue-700 font-bold hover:underline text-sm"
              >
                Learn More About Our Approach <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Join Inner Circle CTA ─────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 mx-6 mb-20 rounded-3xl max-w-6xl lg:mx-auto">
        <div className="text-center px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Join the Inner Circle
          </h2>
          <p className="text-blue-200 max-w-md mx-auto text-base mb-8">
            Receive curated learning insights, exclusive webinar invites, and
            early access to new learning paths.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your academic email"
              className="flex-1 px-5 py-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            />
            <button
              type="submit"
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-blue-300 text-xs mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
