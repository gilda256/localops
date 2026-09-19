export default function NewAppointmentPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900">
          New appointment
        </h1>

        <p className="mt-2 text-slate-600">
          Create an appointment for a customer.
        </p>

        <form className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Service
            </span>

            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Example: Haircut"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Date</span>

            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Notes</span>

            <textarea
              className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Optional notes"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create appointment
          </button>
        </form>
      </section>
    </main>
  );
}