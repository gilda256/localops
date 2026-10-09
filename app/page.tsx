import Link from "next/link";
import { auth } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LocalOps | Service Management",
  description: "Manage your local services with confidence.",
};

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex flex-1 items-center bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            LocalOps
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Manage your local services with confidence.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            LocalOps helps you organize service records, keep important
            information accessible, and manage your local operations in one
            place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}