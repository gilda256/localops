"use client";

import { useEffect, useState, type SubmitEvent } from "react";

interface Customer {
  _id: string;
  name: string;
}

const emptyForm = {
  customerId: "",
  title: "",
  scheduledAt: "",
  notes: "",
};

export default function NewAppointmentPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState(emptyForm.customerId);
  const [title, setTitle] = useState(emptyForm.title);
  const [scheduledAt, setScheduledAt] = useState(emptyForm.scheduledAt);
  const [notes, setNotes] = useState(emptyForm.notes);
  const [message, setMessage] = useState("");
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadCustomers() {
      try {
        const response = await fetch("/api/customers");

        const data: { message?: string; customers?: Customer[] } =
          await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load customers.");
        }

        if (isCurrent) {
          setCustomers(data.customers ?? []);
        }
      } catch {
        if (isCurrent) {
          setMessage(
            "Unable to load customers. Please refresh the page and try again.",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoadingCustomers(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          title,
          scheduledAt,
          notes,
        }),
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to create appointment.");
        return;
      }

      setCustomerId(emptyForm.customerId);
      setTitle(emptyForm.title);
      setScheduledAt(emptyForm.scheduledAt);
      setNotes(emptyForm.notes);
      setMessage("Appointment created successfully.");
    } catch {
      setMessage("Unable to create appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          LocalOps
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          New appointment
        </h1>

        <p className="mt-2 text-slate-600">
          Create an appointment for one of your customers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Customer
            </span>

            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              disabled={isLoadingCustomers || customers.length === 0}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
              required
            >
              <option value="">
                {isLoadingCustomers
                  ? "Loading customers..."
                  : customers.length === 0
                    ? "No customers available"
                    : "Select a customer"}
              </option>

              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>

          {customers.length === 0 && !isLoadingCustomers && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Add a customer before creating an appointment.
            </p>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Service
            </span>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="Example: Haircut"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Date and time
            </span>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Notes
            </span>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="Optional appointment notes"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingCustomers || customers.length === 0}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating appointment..." : "Create appointment"}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}