export default function AppointmentsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>

        <p className="mt-2 text-slate-600">
          View and manage your upcoming appointments.
        </p>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">No appointments created yet.</p>
        </div>
      </section>
    </main>
  );
}