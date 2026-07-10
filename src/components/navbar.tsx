"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b border-gray-800 bg-black shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-100"
        >
          Mystery Message
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-gray-300">
                Welcome,{" "}
                <span className="font-semibold text-gray-100">
                  {session.user?.username ||
                    session.user?.name ||
                    session.user?.email}
                </span>
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                className="rounded-md bg-gray-800 px-4 py-2 text-gray-100 transition hover:bg-gray-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-md bg-gray-100 px-4 py-2 text-black transition hover:bg-white"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-md border border-gray-600 px-4 py-2 text-gray-100 transition hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}