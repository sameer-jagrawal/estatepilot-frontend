"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gauge,
  Handshake,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";
import Button from "@/components/common/Button";
import PricingSection from "@/components/public/PricingSection";

const viewport = { once: true, amount: 0.2 };

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardHover = "transition duration-300 hover:-translate-y-1 hover:border-[#4DA8FF]/50";

const metrics = [
  { icon: BellRing, value: "10x", label: "Faster follow-up workflow" },
  { icon: MessageCircle, value: "0", label: "Missed customer conversations" },
  { icon: LayoutDashboard, value: "1", label: "Dashboard for your entire team" },
  { icon: Building2, value: "100%", label: "Real estate focused CRM" },
];

const growthCards = [
  { icon: Target, title: "Capture every inquiry", text: "Store customer details from calls, walk-ins, referrals, website forms, and WhatsApp in one place." },
  { icon: CalendarCheck, title: "Follow up on time", text: "Never forget who to call today, tomorrow, or next week." },
  { icon: UserCheck, title: "Assign work clearly", text: "Give every lead to the right agent and track who is responsible." },
  { icon: Search, title: "Share the right property", text: "Match customers with properties based on budget, location, and interest." },
  { icon: Route, title: "Convert site visits into deals", text: "Track visit feedback, negotiation stage, and booking progress." },
  { icon: BarChart3, title: "See business performance", text: "Use reports to understand leads, deals, revenue, and agent performance." },
];

const workflowSteps = [
  { icon: Target, title: "Lead captured", text: "Customer details are added manually or through connected channels." },
  { icon: UserCheck, title: "Agent assigned", text: "Owner or manager assigns the lead to the right team member." },
  { icon: BellRing, title: "Follow-up scheduled", text: "Agent creates call, WhatsApp, meeting, or site visit reminders." },
  { icon: Building2, title: "Property shared", text: "Relevant properties are matched and shared with the customer." },
  { icon: Route, title: "Site visit completed", text: "Visit feedback is recorded to move the deal forward." },
  { icon: Handshake, title: "Deal closed", text: "Booking, revenue, commission, and status are tracked." },
];

const features = [
  { icon: Users, title: "Lead Management", badge: "CRM Core", text: "Capture, assign, filter, and track every real estate inquiry." },
  { icon: Building2, title: "Property Inventory", badge: "Sales", text: "Keep searchable stock with budget, location, type, and availability." },
  { icon: BellRing, title: "Follow-up Reminders", badge: "Sales", text: "See today, upcoming, overdue, and completed follow-up tasks." },
  { icon: Route, title: "Site Visit Tracking", badge: "Field", text: "Plan visits, record feedback, and keep deal movement visible." },
  { icon: CircleDollarSign, title: "Deal Management", badge: "Revenue", text: "Track booking status, payment status, revenue, and commission." },
  { icon: MessageCircle, title: "WhatsApp Communication", badge: "WhatsApp", text: "Support WhatsApp-first workflows your agents already understand." },
  { icon: FileText, title: "Notes & Activity Logs", badge: "Team", text: "Record updates so managers know what happened and when." },
  { icon: BarChart3, title: "Reports & Analytics", badge: "Reports", text: "Understand leads, deals, revenue, follow-ups, and performance." },
  { icon: ShieldCheck, title: "User & Role Management", badge: "Access", text: "Create owners, managers, and agents with clear permissions." },
  { icon: Gauge, title: "Super Admin Control", badge: "Admin", text: "Manage tenants, plans, and platform-level business visibility." },
];

const problems = [
  "Leads forgotten after first call",
  "Follow-ups missed",
  "Agents work without clear tracking",
  "Property details scattered",
  "Owner cannot see daily performance",
  "Deals depend on memory",
];

const solutions = [
  "Every lead stored in CRM",
  "Follow-ups shown on dashboard",
  "Agent-wise work tracking",
  "Property inventory searchable",
  "Owner sees reports and activity logs",
  "Deals tracked from inquiry to closing",
];

const roles = [
  {
    title: "Owner",
    icon: BriefcaseBusiness,
    tone: "bg-[#F3EFFF] text-[#7C3AED] border-[#DDD6FE]",
    items: ["Track all leads, users, deals, and revenue", "View reports and activity logs", "Control team access"],
  },
  {
    title: "Manager",
    icon: ClipboardList,
    tone: "bg-[#EAF5FF] text-[#2E95F7] border-[#BBDFFF]",
    items: ["Assign leads", "Monitor follow-ups", "Track site visits and deal progress"],
  },
  {
    title: "Agent",
    icon: UserCheck,
    tone: "bg-[#ECFDF5] text-[#059669] border-[#BBF7D0]",
    items: ["View assigned leads", "Complete daily follow-ups", "Add notes and updates"],
  },
];

const quotes = [
  "A lead is only valuable when your team follows up at the right time.",
  "The best property businesses do not depend on memory. They depend on process.",
  "Every missed follow-up is a missed opportunity.",
  "When your team is organized, your deals move faster.",
];

const reportPoints = [
  "See total leads and active deals",
  "Track agent performance",
  "Understand revenue and commission",
  "Identify overdue follow-ups",
  "Review activity history",
];

const faqs = [
  ["What is EstatePilot?", "EstatePilot is a real estate CRM for managing leads, properties, follow-ups, site visits, deals, users, WhatsApp communication, and reports."],
  ["Who can use EstatePilot?", "Brokers, real estate agencies, builders, property dealers, and sales teams can use it."],
  ["Can agents use their own login?", "Yes. Owners can create managers and agents with role-based access."],
  ["Can I assign leads to agents?", "Yes. Leads can be assigned to agents, and owners/managers can track their work."],
  ["Does EstatePilot support follow-up reminders?", "Yes. You can create follow-ups and see today, upcoming, overdue, and completed tasks."],
  ["Can I manage properties?", "Yes. You can add properties, filter inventory, track availability, and connect properties with site visits and deals."],
  ["Does WhatsApp work inside CRM?", "EstatePilot includes WhatsApp communication structure. Full WhatsApp automation can be connected with Meta WhatsApp Cloud API."],
  ["Can I track my team's performance?", "Yes. Reports, dashboards, and activity logs help owners understand team and business performance."],
  ["Is this suitable for small brokers?", "Yes. It is designed to be simple enough for small brokers and scalable enough for growing teams."],
  ["Is my data separated from other companies?", "Yes. EstatePilot uses multi-tenant architecture so every company's data stays separate."],
];

function SectionHeader({ badge, title, subtitle, align = "center" }) {
  const centered = align === "center";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      {badge ? (
        <span className="inline-flex rounded-full bg-[#EAF5FF] px-3 py-1 text-xs font-medium text-[#2E95F7]">
          {badge}
        </span>
      ) : null}
      <h2 className="mt-4 text-2xl font-semibold leading-tight text-[#0F172A] sm:text-3xl lg:text-[2.4rem]">
        {title}
      </h2>
      <p className={`mt-4 text-sm leading-6 text-[#64748B] sm:text-base ${centered ? "mx-auto max-w-[650px]" : "max-w-[650px]"}`}>
        {subtitle}
      </p>
    </motion.div>
  );
}

function Section({ children, className = "" }) {
  return <section className={`py-16 sm:py-20 lg:py-24 ${className}`}>{children}</section>;
}

function TrustMetricsSection() {
  return (
    <Section className="bg-white">
      <div className="app-container">
        <SectionHeader
          badge="Built for property teams"
          title="Built to make real estate teams faster"
          subtitle="EstatePilot helps brokers organize leads, follow-ups, site visits, deals, and team activity from one simple CRM."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map(({ icon: Icon, value, label }) => (
            <motion.article key={label} variants={fadeUp} className={`group rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.035)] ${cardHover}`}>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7] transition duration-300 group-hover:scale-105">
                <Icon size={20} />
              </div>
              <p className="mt-5 text-3xl font-medium text-[#0F172A]">{value}</p>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">{label}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function GrowthCardsSection() {
  return (
    <Section className="bg-[#F8FAFC]">
      <div className="app-container">
        <SectionHeader
          badge="Growth system"
          title="How EstatePilot helps your business grow"
          subtitle="Growth does not come only from more leads. It comes from managing every lead properly."
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {growthCards.map(({ icon: Icon, title, text }) => (
            <motion.article key={title} variants={fadeUp} className={`group rounded-2xl border border-[#E2E8F0] bg-white p-5 ${cardHover}`}>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7] transition duration-300 group-hover:scale-105 group-hover:bg-[#4DA8FF] group-hover:text-white">
                <Icon size={21} />
              </div>
              <h3 className="mt-5 text-lg font-medium text-[#0F172A]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function WorkflowSection() {
  return (
    <Section className="bg-white">
      <div className="app-container">
        <SectionHeader
          badge="CRM workflow"
          title="From inquiry to closed deal"
          subtitle="EstatePilot gives your team a clear workflow to turn property inquiries into booked deals."
        />
        <div className="relative mt-14">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={viewport}
            className="absolute bottom-8 left-6 top-8 w-px origin-top bg-gradient-to-b from-[#4DA8FF] via-[#A78BFA] to-[#4DA8FF] lg:hidden"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={viewport}
            className="absolute left-[8%] right-[8%] top-8 hidden h-px origin-left bg-gradient-to-r from-[#4DA8FF] via-[#A78BFA] to-[#4DA8FF] lg:block"
          />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 lg:grid-cols-6">
            {workflowSteps.map(({ icon: Icon, title, text }, index) => (
              <motion.article key={title} variants={index % 2 === 0 ? fadeLeft : fadeUp} className="relative ml-11 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#4DA8FF]/50 lg:ml-0">
                <div className="flex items-center gap-4 lg:grid lg:place-items-center">
                  <span className="absolute -left-[3.2rem] grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7] ring-8 ring-white lg:static">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-medium text-[#A78BFA]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-base font-medium text-[#0F172A]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function FeatureShowcaseSection() {
  return (
    <Section className="bg-[#F8FAFC]">
      <div className="app-container">
        <SectionHeader
          badge="Feature showcase"
          title="Everything your real estate team needs"
          subtitle="Designed for brokers, agencies, builders, and property sales teams."
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, title, badge, text }) => (
            <motion.article key={title} variants={fadeUp} className={`group rounded-2xl border border-[#E2E8F0] bg-white p-5 ${cardHover}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7] transition group-hover:bg-[#4DA8FF] group-hover:text-white">
                  <Icon size={18} />
                </span>
                <span className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-medium text-[#64748B]">{badge}</span>
              </div>
              <h3 className="mt-5 text-base font-medium text-[#0F172A]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function BulletList({ items }) {
  return (
    <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mt-6 grid gap-3">
      {items.map((item) => (
        <motion.li key={item} variants={fadeUp} className="flex gap-3 text-sm leading-6 text-[#64748B]">
          <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#2E95F7]">
            <Check size={13} />
          </span>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

function ProblemSolutionSection() {
  return (
    <Section className="bg-white">
      <div className="app-container">
        <SectionHeader
          badge="Before and after"
          title="Stop losing deals in scattered communication"
          subtitle="Most real estate teams lose customers because information is spread across phones, WhatsApp chats, notebooks, and memory."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <motion.article variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <h3 className="text-xl font-medium text-[#0F172A]">Without EstatePilot</h3>
            <BulletList items={problems} />
          </motion.article>
          <motion.article variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-2xl border border-[#BBDFFF] bg-[#FBFDFF] p-6">
            <h3 className="text-xl font-medium text-[#0F172A]">With EstatePilot</h3>
            <BulletList items={solutions} />
          </motion.article>
        </div>
      </div>
    </Section>
  );
}

function RoleBenefitsSection() {
  return (
    <Section className="bg-[#F8FAFC]">
      <div className="app-container">
        <SectionHeader
          badge="Team roles"
          title="Built for every role in your real estate team"
          subtitle="Everyone sees what they need. Owners get control, managers get visibility, and agents get focus."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {roles.map(({ title, icon: Icon, tone, items }, index) => {
            const variant = index === 0 ? fadeLeft : index === 1 ? fadeUp : fadeRight;
            return (
              <motion.article key={title} variants={variant} initial="hidden" whileInView="visible" viewport={viewport} className={`rounded-2xl border bg-white p-6 ${tone} ${cardHover}`}>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/75">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-medium text-[#0F172A]">{title}</h3>
                <ul className="mt-5 grid gap-3">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#475569]">
                      <Check size={16} className="mt-1 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function QuoteStripSection() {
  return (
    <Section className="bg-white">
      <div className="app-container">
        <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewport} className="relative overflow-hidden rounded-2xl border border-[#D8ECFF] bg-[#EAF5FF] p-6 text-center sm:p-10">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              aria-hidden="true"
              animate={{ y: [0, -10, 0], x: [0, item % 2 ? 8 : -8, 0] }}
              transition={{ duration: 5 + item, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-3 w-3 rounded-full bg-[#A78BFA]/35"
              style={{ left: `${18 + item * 28}%`, top: `${18 + item * 20}%` }}
            />
          ))}
          <motion.h2 variants={fadeUp} className="relative text-2xl font-semibold leading-tight text-[#0F172A] sm:text-3xl">
            Your team does not need more confusion. It needs a system.
          </motion.h2>
          <div className="relative mt-8 grid gap-4 md:grid-cols-2">
            {quotes.map((quote) => (
              <motion.blockquote key={quote} variants={fadeUp} className="rounded-2xl border border-white/70 bg-white/75 p-5 text-sm leading-7 text-[#475569]">
                &quot;{quote}&quot;
              </motion.blockquote>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function ReportsVisibilitySection() {
  const bars = [42, 72, 54, 86, 66, 92];

  return (
    <Section className="bg-[#F8FAFC]">
      <div className="app-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewport}>
          <SectionHeader
            align="left"
            badge="Reports and visibility"
            title="Know what is happening in your business"
            subtitle="EstatePilot gives owners and managers clear visibility into team performance and sales pipeline."
          />
          <ul className="mt-7 grid gap-3">
            {reportPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-[#64748B]">
                <Check size={17} className="mt-1 shrink-0 text-[#2E95F7]" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-3 sm:grid-cols-4">
            {[
              ["Leads", "1,240"],
              ["Deals", "86"],
              ["Revenue", "Rs. 4.8Cr"],
              ["Follow-ups", "32"],
            ].map(([label, value]) => (
              <motion.div key={label} variants={fadeUp} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <p className="text-xs text-[#64748B]">{label}</p>
                <p className="mt-1 text-lg font-medium text-[#0F172A]">{value}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-2xl border border-[#E2E8F0] p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#0F172A]">Monthly pipeline</span>
                <LineChart size={18} className="text-[#2E95F7]" />
              </div>
              <div className="flex h-44 items-end gap-3">
                {bars.map((height, index) => (
                  <motion.span
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                    viewport={viewport}
                    className="flex-1 rounded-t-xl bg-gradient-to-t from-[#4DA8FF] to-[#A78BFA]"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#0F172A]">Agent performance</span>
                <Activity size={18} className="text-[#A78BFA]" />
              </div>
              <div className="grid gap-3">
                {[
                  ["Aarav", "92%"],
                  ["Meera", "84%"],
                  ["Rohan", "78%"],
                ].map(([name, score]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-3 py-2 text-sm">
                    <span className="text-[#64748B]">{name}</span>
                    <span className="font-medium text-[#0F172A]">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <Section className="bg-white">
      <div className="app-container">
        <SectionHeader
          badge="FAQ"
          title="Frequently asked questions"
          subtitle="Everything brokers usually ask before choosing a CRM."
        />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mx-auto mt-10 grid max-w-4xl gap-3">
          {faqs.map(([question, answer], index) => {
            const active = open === index;
            return (
              <motion.article key={question} variants={fadeUp} className="rounded-2xl border border-[#E2E8F0] bg-white">
                <button type="button" onClick={() => setOpen(active ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-sm font-medium text-[#0F172A] sm:text-base">{question}</span>
                  <motion.span animate={{ rotate: active ? 180 : 0 }} transition={{ duration: 0.2 }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#2E95F7]">
                    <ChevronDown size={17} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {active ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-6 text-[#64748B]">{answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}

function FinalCTASection() {
  return (
    <Section className="bg-white">
      <div className="app-container">
        <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewport} className="relative overflow-hidden rounded-2xl border border-[#D8ECFF] bg-[#FBFDFF] p-7 text-center sm:p-12">
          {[0, 1].map((item) => (
            <motion.span
              key={item}
              aria-hidden="true"
              animate={{ y: [0, -14, 0], x: [0, item ? -10 : 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-24 w-24 rounded-full bg-[#EAF5FF]"
              style={{ left: item ? "auto" : "-2rem", right: item ? "-2rem" : "auto", top: item ? "auto" : "1rem", bottom: item ? "0" : "auto" }}
            />
          ))}
          <div className="relative">
            <span className="inline-flex rounded-full bg-[#EAF5FF] px-3 py-1 text-xs font-medium text-[#2E95F7]">Start clean</span>
            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-semibold leading-tight text-[#0F172A] sm:text-3xl">
              Ready to organize your real estate business?
            </h2>
            <p className="mx-auto mt-4 max-w-[650px] text-sm leading-6 text-[#64748B] sm:text-base">
              Start managing leads, follow-ups, properties, site visits, and deals from one clean CRM dashboard.
            </p>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <motion.div variants={fadeUp}>
                <Button href="/register-company">Create Your Company Account</Button>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button href="/login" variant="secondary">Login</Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export default function LandingContent() {
  return (
    <>
      <TrustMetricsSection />
      <GrowthCardsSection />
      <WorkflowSection />
      <FeatureShowcaseSection />
      <ProblemSolutionSection />
      <RoleBenefitsSection />
      <QuoteStripSection />
      <ReportsVisibilitySection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
