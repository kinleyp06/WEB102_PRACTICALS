"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/authContext";

export function LoginForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Logged in successfully");
      onSuccess?.();
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-pink-500 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/signup" className="text-pink-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export function SignupForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(
        data.username,
        data.email,
        data.password,
        data.name || data.username,
      );
      toast.success("Account created! Please log in.");
      onSuccess?.();
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Username must be at least 3 characters" },
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-pink-500 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
      >
        {isLoading ? "Signing up..." : "Sign up"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-pink-500 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
