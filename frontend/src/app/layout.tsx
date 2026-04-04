import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F4 Forum — The Academic Curator",
  description:
    "F4 Forum is a premium English center for elite learners. Fast, Focus, Future, Foundation.",
};

import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <QueryProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
          </QueryProvider>
      </body>
    </html>
  );
}
