export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-blue-600">
          LocalOps
        </p>

        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900">
          Simple business management for local service providers.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Manage customers and appointments in one simple dashboard.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/login"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Log in
          </a>

          <a
            href="/register"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Create account
          </a>
        </div>
      </section>
    </main>
  );
}