"use client";

import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
}

interface Appointment {
  _id: string;
  customerId: string;
  title: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

function formatAppointmentDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusClasses(status: Appointment["status"]): string {
  if (status === "completed") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "cancelled") {
    return "bg-red-100 text-red-800";
  }

  return "bg-blue-100 text-blue-800";
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        const [appointmentsResponse, customersResponse] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/customers"),
        ]);

        const appointmentsData: {
          message?: string;
          appointments?: Appointment[];
        } = await appointmentsResponse.json();

        const customersData: {
          message?: string;
          customers?: Customer[];
        } = await customersResponse.json();

        if (!appointmentsResponse.ok) {
          throw new Error(
            appointmentsData.message || "Unable to load appointments.",
          );
        }

        if (!customersResponse.ok) {
          throw new Error(
            customersData.message || "Unable to load customer information.",
          );
        }

        if (isCurrent) {
          setAppointments(appointmentsData.appointments ?? []);
          setCustomers(customersData.customers ?? []);
        }
      } catch {
        if (isCurrent) {
          setMessage("Unable to load appointments. Please refresh the page.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isCurrent = false;
    };
  }, []);

  function getCustomerName(customerId: string): string {
    return (
      customers.find((customer) => customer._id === customerId)?.name ??
      "Unknown customer"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            LocalOps
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Appointments
          </h1>
          <p className="mt-2 text-slate-600">
            View and manage your upcoming appointments.
          </p>
        </header>

        {message && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {message}
          </p>
        )}

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          {isLoading ? (
            <p className="text-slate-600">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div>
              <p className="text-slate-600">No appointments created yet.</p>
              <a
                href="/appointments/new"
                className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create your first appointment
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <article
                  key={appointment._id}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">
                        {appointment.title}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {getCustomerName(appointment.customerId)}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {formatAppointmentDate(appointment.scheduledAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses(
                        appointment.status,
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {appointment.notes && (
                    <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">
                      {appointment.notes}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}