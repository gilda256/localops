import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Dashboard | LocalOps",
  description: "Your LocalOps dashboard.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1 bg-slate-100 px-6 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            LocalOps Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back, {session.user.name}
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-700">
            You are signed in as{" "}
            <span className="font-semibold text-slate-950">
              {session.user.email}
            </span>
            .
          </p>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <LogoutButton />
          </div>
        </div>
      </section>
    </main>
  );
}