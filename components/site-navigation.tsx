import Link from "next/link";

import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button";

export default async function SiteNavigation() {
  const session = await auth();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          LocalOps
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 font-medium text-slate-800 hover:bg-slate-100 hover:text-blue-700"
              >
                Dashboard
              </Link>

              <Link
                href="/customers"
                className="rounded-lg px-3 py-2 font-medium text-slate-800 hover:bg-slate-100 hover:text-blue-700"
              >
                Customers
              </Link>

              <Link
                href="/appointments"
                className="rounded-lg px-3 py-2 font-medium text-slate-800 hover:bg-slate-100 hover:text-blue-700"
              >
                Appointments
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}