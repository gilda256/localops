import Link from "next/link";

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Customers</h1>

            <p className="mt-2 text-slate-600">
              Add and manage your business customers.
            </p>
          </div>

          <Link
            href="/customers/new"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Add customer
          </Link>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">No customers added yet.</p>
        </div>
      </section>
    </main>
  );
}