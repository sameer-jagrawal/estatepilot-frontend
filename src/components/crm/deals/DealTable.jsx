"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Edit3, Eye, Handshake, Trash2, XCircle } from "lucide-react";
import DealCard, { DealTypeBadge, agentName, formatCurrency, formatDate, leadName, propertyTitle } from "./DealCard";
import DealStatusBadge from "./DealStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

export function DealTableSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-[#E2E8F0]/70" />)}
      </div>
    </div>
  );
}

export default function DealTable({ deals = [], onView, onEdit, onCloseDeal, onCancelDeal, onDelete }) {
  if (!deals.length) {
    return (
      <section className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]"><Handshake size={24} /></div>
          <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No deals found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#64748B]">Add a booking or adjust filters to see matching deal records.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hidden min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.04)] 2xl:block">
        <div className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)_minmax(0,0.85fr)_minmax(0,0.58fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.74fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_minmax(0,1.05fr)] gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#64748B] [&>*]:min-w-0">
          <span>Lead</span><span>Property</span><span>Agent</span><span>Deal Type</span><span>Deal Amount</span><span>Commission</span><span>Token Amount</span><span>Payment Status</span><span>Deal Status</span><span>Booking Date</span><span className="text-right">Actions</span>
        </div>
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
          {deals.map((deal) => (
            <motion.div key={deal?._id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)_minmax(0,0.85fr)_minmax(0,0.58fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.74fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_minmax(0,1.05fr)] items-center gap-2 border-b border-[#E2E8F0] px-4 py-4 text-xs transition last:border-b-0 hover:bg-[#F8FAFC] hover:shadow-sm [&>*]:min-w-0">
              <span className="truncate font-semibold text-[#0F172A]">{leadName(deal)}</span>
              <span className="truncate font-semibold text-[#0F172A]">{propertyTitle(deal)}</span>
              <span className="truncate text-[#64748B]">{agentName(deal)}</span>
              <DealTypeBadge value={deal?.dealType} />
              <span className="font-semibold text-[#0F172A]">{formatCurrency(deal?.dealAmount)}</span>
              <span className="font-semibold text-[#0F172A]">{formatCurrency(deal?.commissionAmount)}</span>
              <span className="font-semibold text-[#0F172A]">{formatCurrency(deal?.tokenAmount)}</span>
              <PaymentStatusBadge value={deal?.paymentStatus} />
              <DealStatusBadge value={deal?.dealStatus} />
              <span className="font-semibold text-[#0F172A]">{formatDate(deal?.bookingDate || deal?.createdAt)}</span>
              <div className="flex justify-end gap-1">
                <ActionButton label="View" icon={Eye} onClick={() => onView(deal)} />
                <ActionButton label="Edit" icon={Edit3} onClick={() => onEdit(deal)} />
                <ActionButton label="Close Deal" icon={CheckCircle2} onClick={() => onCloseDeal(deal)} />
                <ActionButton label="Cancel Deal" icon={XCircle} onClick={() => onCancelDeal(deal)} />
                <ActionButton label="Delete" icon={Trash2} onClick={() => onDelete(deal)} danger />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <motion.section initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-3 2xl:hidden">
        {deals.map((deal) => (
          <motion.div key={deal?._id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <DealCard deal={deal} onView={onView} onEdit={onEdit} onCloseDeal={onCloseDeal} onCancelDeal={onCancelDeal} onDelete={onDelete} />
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}

function ActionButton({ label, icon: Icon, danger = false, onClick }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-xl transition ${danger ? "text-[#DC2626] hover:bg-[#FEE2E2]" : "text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#2E95F7]"}`}>
      <Icon size={15} />
    </button>
  );
}
