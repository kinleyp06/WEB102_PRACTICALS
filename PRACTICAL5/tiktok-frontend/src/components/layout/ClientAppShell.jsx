"use client";

import AppProviders from "@/providers/AppProviders";
import AppShell from "@/components/layout/AppShell";

export default function ClientAppShell({ children }) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
