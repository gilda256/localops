"use client";

import { useState } from "react";

export default function NewCustomerPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("Customer form submitted:", { name, phone, email });

    setSuccess(
      "Customer information was submitted successfully."
    );
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold text-slate-900">
          Add New Customer
        </h1>

        <p className="mt-2 text-slate-600">
          Enter the customer&apos;s contact information below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-md bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
          >
            {loading ? "Creating..." : "Create Customer"}
          </button>
        </form>
      </section>
    </main>
  );
}