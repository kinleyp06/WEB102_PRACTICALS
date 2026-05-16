"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaPlusCircle,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/contexts/authContext";
import AuthModal from "@/components/auth/AuthModal";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const linkClass = (path) =>
    `flex items-center rounded-lg p-2 ${
      pathname === path
        ? "bg-pink-50 text-pink-500"
        : "hover:bg-zinc-100 text-zinc-700"
    }`;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-zinc-200 bg-white p-4">
        <Link href="/" className="mb-8 text-2xl font-bold text-pink-500">
          TikTok
        </Link>

        <nav className="flex-1 space-y-2">
          <Link href="/" className={linkClass("/")}>
            <FaHome className="mr-3" /> For You
          </Link>
          <Link href="/following" className={linkClass("/following")}>
            <FaUsers className="mr-3" /> Following
          </Link>
          <Link href="/explore-users" className={linkClass("/explore-users")}>
            <FaUsers className="mr-3" /> Find Users
          </Link>
        </nav>

        <div className="mt-auto space-y-2">
          {loading ? (
            <p className="text-center text-sm text-zinc-400">Loading...</p>
          ) : isAuthenticated ? (
            <>
              <Link
                href="/upload"
                className="flex w-full items-center justify-center rounded-full bg-pink-500 p-2 text-white hover:bg-pink-600"
              >
                <FaPlusCircle className="mr-2" /> Upload
              </Link>
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center rounded-lg p-2 hover:bg-zinc-100"
              >
                <FaUser className="mr-3" /> Profile
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center rounded-lg p-2 hover:bg-zinc-100"
              >
                <FaSignOutAlt className="mr-3" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full bg-pink-500 p-2 text-white hover:bg-pink-600"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex w-full items-center justify-center rounded-full border border-pink-500 p-2 text-pink-500 hover:bg-pink-50"
              >
                Sign up
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full text-center text-sm text-zinc-500 hover:text-pink-500"
              >
                Or use popup login
              </button>
            </>
          )}
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
