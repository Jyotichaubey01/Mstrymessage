"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post("/api/sign-in", formData);

      alert("Login Successful!");

      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email/username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-4xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Sign in to your Mystery Message account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Email or Username
            </label>

            <input
              type="text"
              name="identifier"
              placeholder="Enter email or username"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}