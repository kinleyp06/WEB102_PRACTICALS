"use client";

import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/queryProvider";
import { AuthProvider } from "@/contexts/authContext";

export default function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryProvider>
  );
}
