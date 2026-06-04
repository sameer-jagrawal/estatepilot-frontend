import { Building2, CalendarCheck, MessageCircle, Route, Users, WalletCards } from "lucide-react";
import { features } from "@/lib/data";
import ScrollReveal from "@/components/common/ScrollReveal";

const icons = [Users, MessageCircle, CalendarCheck, Building2, Route, WalletCards];

export default function FeaturesSection() {
  return (
    <div className="landing-panel bg-white">
      <div className="app-container">
        <ScrollReveal className="max-w-2xl" y={42} scale={0.9} blur={8}>
          <p className="text-sm font-medium uppercase text-[#A78BFA]">Features</p>
          <h2 className="text-gradient-primary mt-3 text-2xl font-semibold sm:text-3xl">
            Everything a property team needs to move faster
          </h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature}
              delay={index * 0.08}
              x={index % 2 === 0 ? -70 : 70}
              y={36}
              scale={0.88}
              rotate={index % 2 === 0 ? -2 : 2}
              blur={10}
            >
            <article className="motion-card h-full p-5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-6">
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-[#F3FAFF] text-[#2E95F7]">
                {(() => {
                  const Icon = icons[index] || Users;
                  return <Icon size={20} strokeWidth={2.2} />;
                })()}
              </div>
              <h3 className="text-gradient-soft text-base font-medium sm:text-lg">{feature}</h3>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                Keep every inquiry, task, and conversation organized in a workflow designed for brokers and agents.
              </p>
            </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
