"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/authContext";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.name,
      );

      toast.success("Registration successful");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
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
        <h1 className="mb-2 text-3xl font-bold">Sign up</h1>
        <p className="mb-5 text-sm text-zinc-500">Create your TikTok account.</p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="mb-4 w-full border p-3"
          required
          disabled={loading}
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 w-full border p-3"
          required
          disabled={loading}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full border p-3"
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 w-full border p-3"
          required
          minLength={6}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pink-500 py-3 text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
