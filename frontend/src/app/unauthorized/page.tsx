import Link from 'next/link';

export const metadata = {
  title: 'Không có quyền truy cập | F4 Forum',
  description: 'Bạn không có quyền truy cập vào trang này.',
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-sans">
      <div className="text-center max-w-md px-8">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">
          Lỗi 403 — Forbidden
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Không có quyền truy cập
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Tài khoản của bạn không có quyền truy cập vào trang này.
          Vui lòng đăng nhập bằng tài khoản có đủ quyền hoặc liên hệ quản trị viên.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
}
