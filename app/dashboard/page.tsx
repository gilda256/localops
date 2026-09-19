const summaryCards = [
  { label: "Customers", value: "0" },
  { label: "Upcoming appointments", value: "0" },
  { label: "Pending requests", value: "0" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <header>
          <p className="text-sm font-medium text-blue-600">LocalOps</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your customers and upcoming appointments.
          </p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}