"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

function toDateTimeLocal(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function EditAppointmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [status, setStatus] =
    useState<Appointment["status"]>("scheduled");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        const [appointmentResponse, customersResponse] = await Promise.all([
          fetch(`/api/appointments/${params.id}`),
          fetch("/api/customers"),
        ]);

        const appointmentData: {
          message?: string;
          appointment?: Appointment;
        } = await appointmentResponse.json();

        const customersData: {
          message?: string;
          customers?: Customer[];
        } = await customersResponse.json();

        if (!appointmentResponse.ok || !appointmentData.appointment) {
          throw new Error(
            appointmentData.message || "Unable to load appointment.",
          );
        }

        if (!customersResponse.ok) {
          throw new Error(
            customersData.message || "Unable to load customers.",
          );
        }

        if (isCurrent) {
          const appointment = appointmentData.appointment;

          setCustomers(customersData.customers ?? []);
          setCustomerId(appointment.customerId);
          setTitle(appointment.title);
          setScheduledAt(toDateTimeLocal(appointment.scheduledAt));
          setStatus(appointment.status);
          setNotes(appointment.notes ?? "");
        }
      } catch (error) {
        if (isCurrent) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load appointment.",
          );
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
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/appointments/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          title,
          scheduledAt,
          status,
          notes,
        }),
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update appointment.");
        return;
      }

      router.push("/appointments");
      router.refresh();
    } catch {
      setMessage("Unable to update appointment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-2xl">
        <Link
          href="/appointments"
          className="text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          ← Back to appointments
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            LocalOps
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Edit appointment
          </h1>

          <p className="mt-2 text-slate-600">
            Update appointment details, customer, date, and status.
          </p>
        </header>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          {isLoading ? (
            <p className="text-slate-600">Loading appointment...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {message && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {message}
                </p>
              )}

              <div>
                <label
                  htmlFor="customerId"
                  className="block text-sm font-medium text-slate-800"
                >
                  Customer
                </label>

                <select
                  id="customerId"
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select a customer</option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-800"
                >
                  Appointment title
                </label>

                <input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  maxLength={120}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="scheduledAt"
                  className="block text-sm font-medium text-slate-800"
                >
                  Date and time
                </label>

                <input
                  id="scheduledAt"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-slate-800"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as Appointment["status"],
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-slate-800"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  maxLength={1_000}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>

                <Link
                  href="/appointments"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}