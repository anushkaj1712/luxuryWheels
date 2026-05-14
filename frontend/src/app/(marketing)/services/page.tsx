const services = [
  { title: "Acquire", desc: "Sourcing, inspection, title diligence, and enclosed delivery." },
  { title: "Liquidate", desc: "Discreet consignment with global buyer matching." },
  { title: "Finance", desc: "Bespoke structures aligned to liquidity events." },
  { title: "Insurance", desc: "Agreed-value policies with specialist underwriters." },
  { title: "Exchange", desc: "Equity bridge between outgoing and incoming vehicles." },
  { title: "Test drive", desc: "Private runway or curated road routes with engineers." },
  { title: "Doorstep delivery", desc: "White-glove handover anywhere in the world." },
  { title: "VIP concierge", desc: "24/7 travel, lifestyle, and collection orchestration." },
  { title: "Detailing", desc: "Ceramic, PPF, and concours preparation studios." },
  { title: "Maintenance", desc: "OEM-correct service programs and seasonal storage." },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl text-white">Services</h1>
      <p className="mt-4 max-w-2xl text-sm text-white/55">A single relationship layer across acquisition, protection, and enjoyment.</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-lg text-white">{s.title}</h2>
            <p className="mt-2 text-sm text-white/55">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
