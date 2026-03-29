**# Frontend Project Guide: Next.js 15 + React 19

File này cung cấp ngữ cảnh về kỹ năng và quy chuẩn dự án cho Claude Code. Hãy tuân thủ các chỉ dẫn này khi thực hiện các yêu cầu lập trình.

## 🛠 Tech Stack (Kỹ năng Frontend 2026)

* Framework: Next.js 15 (App Router), React 19.
* Styling: Tailwind CSS v4 (Sử dụng CSS-first configuration).
* Language: TypeScript (Strict mode).
* State Management: Zustand (Client state), TanStack Query v5 (Server state).
* UI Components: Shadcn/ui (Radix UI), Lucide React icons.
* Validation: Zod.
* AI Tooling: Claude Code CLI, MCP (Model Context Protocol).

## 📏 Quy chuẩn viết code (Coding Standards)

* Component: Sử dụng Functional Components và Arrow Functions. Ưu tiên "Composition over Inheritance".
* React 19: Sử dụng use hook cho Promises, Action cho form handling, và useOptimistic cho trải nghiệm mượt mà.
* Server vs Client: Mặc định là Server Components. Chỉ dùng 'use client' khi thực sự cần interactivity hoặc browser APIs.
* Naming: - Component: PascalCase (e.g., UserCard.tsx).
* Hook: camelCase bắt đầu bằng use (e.g., useAuth.ts).
* Variable/Function: camelCase.
* Types: Luôn định nghĩa Interface/Type rõ ràng. Tránh sử dụng any.

## 💻 Lệnh Terminal (CLI Commands)

* Cài đặt: pnpm install
* Chạy Dev: pnpm dev
* Build: pnpm build
* Lint: pnpm lint hoặc biome check --write
* Test: pnpm test (Sử dụng Vitest)

## 🤖 Chỉ dẫn cho AI (Agent Instructions)

* Refactoring: Khi refactor code, hãy đảm bảo không làm mất tính dễ tiếp cận (Accessibility - A11y).
* Error Handling: Luôn bọc các API calls trong khối try-catch và hiển thị thông báo thân thiện thông qua Toast components.
* Performance: Ưu tiên sử dụng next/image và next/font để tối ưu Core Web Vitals.
* Git: Viết commit message theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/).

Ghi chú: Đây là dự án của Coffat (HCMUTE). Hãy hỗ trợ với tư cách là một Senior Frontend Mentor.

**
