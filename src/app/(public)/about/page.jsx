export default function AboutPage() {
  return (
    <section className="section-y">
      <div className="app-container grid gap-8 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-sm font-medium uppercase text-[#A78BFA]">About EstatePilot</p>
          <h1 className="mt-3 text-4xl font-medium">A cleaner operating system for property sales teams</h1>
        </div>
        <div className="saas-card p-8 text-[#64748B]">
          <p className="leading-7">
            EstatePilot is built for brokers, managers, and agents who live inside WhatsApp but need a reliable CRM around every inquiry, follow-up, site visit, and deal.
          </p>
          <p className="mt-5 leading-7">
            The product keeps the sales workflow simple, fast, and accountable without forcing real estate teams into generic CRM complexity.
          </p>
        </div>
      </div>
    </section>
  );
}
