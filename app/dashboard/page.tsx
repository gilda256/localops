import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button";
import { getDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Dashboard | LocalOps",
  description: "Your LocalOps dashboard.",
};

interface UpcomingAppointment {
  _id: string;
  title: string;
  scheduledAt: Date;
  customerName: string;
}

function formatAppointmentDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const db = await getDatabase();
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const customers = db.collection("customers");
  const appointments = db.collection("appointments");

  const [
    customerCount,
    todayAppointmentCount,
    upcomingAppointmentCount,
    upcomingAppointments,
  ] = await Promise.all([
    customers.countDocuments({ userId: session.user.id }),
    appointments.countDocuments({
      userId: session.user.id,
      status: "scheduled",
      scheduledAt: {
        $gte: startOfToday,
        $lt: startOfTomorrow,
      },
    }),
    appointments.countDocuments({
      userId: session.user.id,
      status: "scheduled",
      scheduledAt: { $gte: now },
    }),
    appointments
      .aggregate<UpcomingAppointment>([
        {
          $match: {
            userId: session.user.id,
            status: "scheduled",
            scheduledAt: { $gte: now },
          },
        },
        { $sort: { scheduledAt: 1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $project: {
            _id: { $toString: "$_id" },
            title: 1,
            scheduledAt: 1,
            customerName: {
              $ifNull: [{ $arrayElemAt: ["$customer.name", 0] }, "Unknown customer"],
            },
          },
        },
      ])
      .toArray(),
  ]);

  return (
    <main className="flex flex-1 bg-slate-100 px-6 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            LocalOps Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back, {session.user.name}
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-700">
            Here is an overview of your customers and appointments.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Total customers
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {customerCount}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Today&apos;s appointments
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {todayAppointmentCount}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">
              Upcoming appointments
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {upcomingAppointmentCount}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Next appointments
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Your next five scheduled appointments.
              </p>
            </div>

            <Link
              href="/appointments"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              View all
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <p className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
              No upcoming appointments. Create one from the appointments page.
            </p>
          ) : (
            <div className="mt-6 divide-y divide-slate-200">
              {upcomingAppointments.map((appointment) => (
                <article
                  key={appointment._id}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {appointment.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {appointment.customerName}
                    </p>
                  </div>

                  <time
                    dateTime={appointment.scheduledAt.toISOString()}
                    className="text-sm font-medium text-slate-700"
                  >
                    {formatAppointmentDate(appointment.scheduledAt)}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}