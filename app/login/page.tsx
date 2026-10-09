"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setMessage("Email or password is incorrect.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Log in</h1>

        <p className="mt-2 text-sm text-slate-600">
          Access your LocalOps dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}