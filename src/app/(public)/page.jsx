import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import FeaturesSection from "@/components/public/FeaturesSection";
import HeroSection from "@/components/public/HeroSection";
import LazyLandingSection from "@/components/public/LazyLandingSection";
import MobileWorkflowAccordion from "@/components/public/MobileWorkflowAccordion";
import PricingSection from "@/components/public/PricingSection";

const trust = ["10x Faster Follow-ups", "0 Missed Leads", "WhatsApp Ready", "Built for Real Estate"];
const steps = ["Capture Leads", "Assign Agents", "Schedule Follow-ups", "Close Deals"];
const quotes = [
  "Your next property deal should not be lost in WhatsApp chats.",
  "Turn scattered inquiries into a clean sales pipeline.",
  "Give every broker a system that remembers every follow-up.",
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LazyLandingSection name="trust" className="bg-white" placeholderClassName="min-h-[75vh]">
        <div className="landing-panel app-container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((item, index) => (
              <ScrollReveal key={item} delay={index * 0.08} x={index % 2 === 0 ? -70 : 70} y={34} scale={0.86} rotate={index % 2 === 0 ? -3 : 3} blur={10}>
              <div className="text-gradient-accent motion-card magnetic-card p-4 text-center text-sm font-semibold transition duration-300 hover:-translate-y-2 sm:p-5 sm:text-base">
                {item}
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </LazyLandingSection>
      <LazyLandingSection name="features" className="bg-white">
        <FeaturesSection />
      </LazyLandingSection>
      <LazyLandingSection name="workflow" className="landing-sky">
        <div className="landing-panel app-container">
          <ScrollReveal y={44} scale={0.9} blur={8}>
            <Badge tone="blue">How it works</Badge>
            <h2 className="text-gradient-primary mt-3 max-w-2xl text-2xl font-semibold sm:text-3xl">
              A simple flow your agents can actually use
            </h2>
          </ScrollReveal>
          <MobileWorkflowAccordion steps={steps} />
          <div className="mt-8 hidden gap-4 md:grid md:grid-cols-4">
            {steps.map((step, index) => (
              <ScrollReveal key={step} delay={index * 0.09} x={index % 2 === 0 ? -60 : 60} y={40} scale={0.86} rotate={index % 2 === 0 ? -2 : 2} blur={10}>
              <article className="motion-card h-full p-6 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <span className="text-sm font-medium text-[#A78BFA]">0{index + 1}</span>
                <h2 className="text-gradient-soft mt-3 text-lg font-medium">{step}</h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  Move each lead forward with clear ownership, reminders, and sales context.
                </p>
              </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </LazyLandingSection>
      <LazyLandingSection name="proof" className="bg-white">
        <div className="landing-panel app-container grid gap-4 md:grid-cols-3">
          {quotes.map((quote, index) => (
            <ScrollReveal key={quote} delay={index * 0.1} x={index === 1 ? 0 : index === 0 ? -80 : 80} y={36} scale={0.86} rotate={index === 1 ? 0 : index === 0 ? -2 : 2} blur={10}>
            <blockquote className="text-gradient-primary motion-card p-5 text-base font-semibold leading-7 sm:p-6 sm:text-lg sm:leading-8">
              &quot;{quote}&quot;
            </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </LazyLandingSection>
      <LazyLandingSection name="pricing" className="landing-sky">
        <PricingSection />
      </LazyLandingSection>
      <LazyLandingSection name="cta" className="bg-white" placeholderClassName="min-h-[70vh]">
        <div className="landing-panel app-container">
        <ScrollReveal className="motion-card bg-[#FBFDFF] p-6 text-center md:p-12" x={0} y={44} scale={0.86} rotate={1} blur={10}>
          <h2 className="text-gradient-primary text-2xl font-semibold sm:text-3xl">Ready to organize your real estate business?</h2>
          <div className="mt-7">
            <Button href="/register-company">Create Your Company Account</Button>
          </div>
        </ScrollReveal>
        </div>
      </LazyLandingSection>
    </>
  );
}
