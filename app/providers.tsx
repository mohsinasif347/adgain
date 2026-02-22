"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    // "attribute" lazmi "class" hona chahiye
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}