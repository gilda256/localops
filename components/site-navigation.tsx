import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button";

export default async function SiteNavigation() {
  const session = await auth();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold text-slate-900"
        >
          LocalOps
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-800 hover:text-blue-700"
              >
                Dashboard
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-700 hover:text-blue-600"
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