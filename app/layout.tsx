import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HeaderNav } from "@/components/HeaderNav";
import PageContainer from "@/components/PageContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Tracker",
  description: "Life Tracker app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-luxury smooth-scroll min-h-screen`}
      >
        <ThemeProvider>
          <div className="min-h-screen w-full px-6 py-8 sm:px-10 sm:py-12 text-foreground">
            <HeaderNav />
            <PageContainer>
              {children}
            </PageContainer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
