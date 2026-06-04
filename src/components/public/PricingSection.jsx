import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import ScrollReveal from "@/components/common/ScrollReveal";
import { pricingPlans } from "@/lib/data";

export default function PricingSection() {
  return (
    <div className="landing-panel landing-sky">
      <div className="app-container">
        <ScrollReveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end" y={46} scale={0.9} blur={8}>
          <div>
            <Badge tone="lavender">Custom launch pricing</Badge>
            <h2 className="text-gradient-primary mt-4 text-2xl font-semibold sm:text-3xl">Start with the plan your team needs</h2>
          </div>
          <Button href="/register-company">Create Your Company Account</Button>
        </ScrollReveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.1} x={index === 1 ? 0 : index === 0 ? -80 : 80} y={38} scale={0.88} rotate={index === 1 ? 0 : index === 0 ? -2 : 2} blur={10}>
            <article className="motion-card h-full p-5 transition duration-300 hover:-translate-y-2 sm:p-6">
              <h3 className="text-gradient-soft text-lg font-medium sm:text-xl">{plan.name}</h3>
              <p className="mt-2 text-sm text-[#64748B]">{plan.users}</p>
              <p className="mt-6 text-xl font-medium text-[#2E95F7] sm:text-2xl">{plan.price}</p>
              <Button href="/contact" variant="secondary" className="mt-6 w-full">
                Talk to Sales
              </Button>
            </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
