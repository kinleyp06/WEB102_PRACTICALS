"use client";

import { usePathname } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";

const AUTH_ROUTES = ["/login", "/signup"];

export default function AppShell({ children }) {
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) {
    return children;
  }

  return <MainLayout>{children}</MainLayout>;
}
