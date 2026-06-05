import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function ContactPage() {
  return (
    <section className="section-y">
      <div className="app-container grid gap-8 lg:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-sm font-medium uppercase text-[#A78BFA]">Contact</p>
          <h1 className="mt-3 text-4xl font-medium">Talk to EstatePilot</h1>
          <p className="mt-4 text-[#64748B]">Share your team size and workflow. We will help you map the right launch setup.</p>
        </div>
        <form className="saas-card grid w-full max-w-[520px] gap-4 justify-self-end p-6">
          <Input id="name" label="Name" placeholder="Your name" />
          <Input id="email" label="Email" type="email" placeholder="you@company.com" />
          <label htmlFor="message" className="block">
            <span className="mb-2 block text-sm font-semibold">Message</span>
            <textarea id="message" className="input-field min-h-32" placeholder="Tell us what you want to organize" />
          </label>
          <Button type="button">Send Message</Button>
        </form>
      </div>
    </section>
  );
}
