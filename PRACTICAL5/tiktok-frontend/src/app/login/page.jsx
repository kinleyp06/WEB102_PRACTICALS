"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-2 text-3xl font-bold">Log in</h1>
        <p className="mb-5 text-sm text-zinc-500">
          Sign in to upload videos and like posts.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pink-500 py-3 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-500">
          No account?{" "}
          <Link href="/signup" className="text-pink-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
