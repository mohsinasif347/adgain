import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  // Icons add kar diye hain
  icons: {
    icon: "icon-512x512.png", // Browser tab ke liye
    shortcut: "icon-512x512.png",
    apple: "icon-512x512.png", // iPhone home screen ke liye
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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b1120] text-white selection:bg-blue-500/30`}
      >
        {/* Main Content */}
        <main className="min-h-screen relative z-10">
          {children}
        </main>

        {/* Ambient Global Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        </div>
      </body>
    </html>
  );
}