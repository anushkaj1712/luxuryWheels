"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { LenisProvider } from "./LenisProvider";
import { ApiLoadingProvider } from "./ApiLoadingProvider";
import { DemoRibbon } from "@/components/demo/DemoRibbon";

/**
 * Root client providers: dark/light theme, toast notifications, Lenis scroll, API loading bar, demo ribbon.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <LenisProvider>
        <ApiLoadingProvider>
          {children}
          <Toaster richColors theme="dark" position="top-center" />
          <DemoRibbon />
        </ApiLoadingProvider>
      </LenisProvider>
    </NextThemesProvider>
  );
}
