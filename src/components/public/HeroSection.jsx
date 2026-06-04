"use client";

import Badge from "@/components/common/Badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import RegisterCompanyForm from "@/components/public/RegisterCompanyForm";

export default function HeroSection() {
  return (
    <section className="landing-orbit relative flex min-h-[calc(100vh-64px)] overflow-hidden py-10 md:py-14">
      <div className="orbit-field" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, index) => (
          <span
            key={index}
            style={{
              "--i": index,
              left: `${8 + ((index * 19) % 84)}%`,
              top: `${10 + ((index * 23) % 76)}%`,
            }}
          />
        ))}
      </div>
      <div className="app-container relative z-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.78fr)]">
        <ScrollReveal className="pt-1 lg:pt-2" y={44} scale={0.92} blur={8}>
          <div className="max-w-3xl">
            <Badge tone="blue">Built for real estate sales teams</Badge>
            <h1 className="text-gradient-hero mt-7 text-4xl font-semibold leading-[1.2] sm:text-5xl sm:leading-[1.18]">
              <span className="block">Close more property</span>
              <span className="block">deals with WhatsApp</span>
              <span className="block">first CRM</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#64748B] sm:text-lg sm:leading-9">
              EstatePilot helps brokers manage leads, follow-ups, properties, site visits, and customer conversations from one clean dashboard.
            </p>
            <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Fast lead capture", "Clean follow-ups", "Company setup"].map((item) => (
                <div key={item} className="text-gradient-accent rounded-[1.25rem] border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal className="flex justify-center lg:justify-end" delay={0.16} x={60} y={28} scale={0.9} rotate={2} blur={10}>
          <RegisterCompanyForm compact />
        </ScrollReveal>
      </div>
    </section>
  );
}
