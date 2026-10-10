"use client";

import { useEffect, useState, type SubmitEvent } from "react";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState("");

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/customers")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load customers.");
        }

        return (await response.json()) as { customers: Customer[] };
      })
      .then((data) => {
        if (isCurrent) {
          setCustomers(data.customers);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setMessage("Unable to load customers. Please refresh the page.");
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, notes }),
      });

      const data: { message?: string; customer?: Customer } =
        await response.json();

      if (!response.ok || !data.customer) {
        setMessage(data.message || "Unable to create customer.");
        return;
      }

      setCustomers((currentCustomers) => [
        data.customer as Customer,
        ...currentCustomers,
      ]);

      setName(emptyForm.name);
      setEmail(emptyForm.email);
      setPhone(emptyForm.phone);
      setNotes(emptyForm.notes);
      setMessage("Customer added successfully.");
    } catch {
      setMessage("Unable to create customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(customer: Customer) {
    setMessage("");
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditEmail(customer.email ?? "");
    setEditPhone(customer.phone ?? "");
    setEditNotes(customer.notes ?? "");
  }

  function cancelEditing() {
    setEditingCustomer(null);
    setEditName("");
    setEditEmail("");
    setEditPhone("");
    setEditNotes("");
  }

  async function handleEditSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingCustomer) {
      return;
    }

    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/customers/${editingCustomer._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          notes: editNotes,
        }),
      });

      const data: { message?: string; customer?: Customer } =
        await response.json();

      if (!response.ok || !data.customer) {
        setMessage(data.message || "Unable to update customer.");
        return;
      }

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer._id === data.customer?._id
            ? (data.customer as Customer)
            : customer,
        ),
      );

      cancelEditing();
      setMessage("Customer updated successfully.");
    } catch {
      setMessage("Unable to update customer. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(customer: Customer) {
    const confirmed = window.confirm(
      `Delete ${customer.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setDeletingCustomerId(customer._id);

    try {
      const response = await fetch(`/api/customers/${customer._id}`, {
        method: "DELETE",
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to delete customer.");
        return;
      }

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (currentCustomer) => currentCustomer._id !== customer._id,
        ),
      );

      if (editingCustomer?._id === customer._id) {
        cancelEditing();
      }

      setMessage("Customer deleted successfully.");
    } catch {
      setMessage("Unable to delete customer. Please try again.");
    } finally {
      setDeletingCustomerId("");
    }
  }

  return (
    <main className="flex flex-1 bg-slate-50 px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            LocalOps
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Customers
          </h1>
          <p className="mt-3 text-slate-700">
            Add and manage your business customers.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Add a customer
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Customer name"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="customer@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Phone
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="(555) 555-5555"
                  autoComplete="tel"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Notes
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-1 min-h-28 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Optional customer notes"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Adding customer..." : "Add customer"}
              </button>
            </form>

            {message && (
              <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                {message}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Customer list</h2>

            {isLoading ? (
              <p className="mt-6 text-slate-600">Loading customers...</p>
            ) : customers.length === 0 ? (
              <p className="mt-6 text-slate-600">No customers added yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {customers.map((customer) => (
                  <article
                    key={customer._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    {editingCustomer?._id === customer._id ? (
                      <form
                        onSubmit={handleEditSubmit}
                        className="space-y-4"
                      >
                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">
                            Name
                          </span>
                          <input
                            type="text"
                            value={editName}
                            onChange={(event) =>
                              setEditName(event.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            required
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">
                            Email
                          </span>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(event) =>
                              setEditEmail(event.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">
                            Phone
                          </span>
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(event) =>
                              setEditPhone(event.target.value)
                            }
                            className="mt-1 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">
                            Notes
                          </span>
                          <textarea
                            value={editNotes}
                            onChange={(event) =>
                              setEditNotes(event.target.value)
                            }
                            className="mt-1 min-h-24 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSaving ? "Saving..." : "Save changes"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-950">
                              {customer.name}
                            </h3>

                            {(customer.email || customer.phone) && (
                              <p className="mt-1 text-sm text-slate-600">
                                {[customer.email, customer.phone]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => startEditing(customer)}
                              disabled={deletingCustomerId === customer._id}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(customer)}
                              disabled={deletingCustomerId === customer._id}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingCustomerId === customer._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        {customer.notes && (
                          <p className="mt-3 text-sm leading-6 text-slate-700">
                            {customer.notes}
                          </p>
                        )}
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}