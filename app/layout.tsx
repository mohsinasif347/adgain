import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Providers ko import kiya

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Viewport Settings
export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Metadata: AdGain Branding, PWA, aur Icons
export const metadata: Metadata = {
  title: "AdGain | Watch & Earn Rewards",
  description: "The professional platform to watch ads and earn coins.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-512x512.png", 
    shortcut: "/icon-512x512.png",
    apple: "/icon-512x512.png", 
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AdGain",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* suppressHydrationWarning yahan lazmi hai taake next-themes error na de */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
        bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white 
        selection:bg-blue-500/30 transition-colors duration-300`}
      >
        {/* Poori app ko Providers mein wrap kar diya */}
        <Providers>
          <main className="min-h-screen relative z-10">
            {children}
          </main>

          {/* Ambient Global Background Glows - Sirf Dark mode mein zyada achay lagtay hain */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50 dark:opacity-100">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] rounded-full" />
          </div>
        </Providers>
      </body>
    </html>
  );
}