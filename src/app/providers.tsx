"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NuqsAdapter>
        {children}
        <Toaster />
      </NuqsAdapter>
    </SessionProvider>
  );
}
