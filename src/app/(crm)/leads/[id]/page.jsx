"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import AddNoteModal from "@/components/crm/leads/AddNoteModal";
import LeadFormModal from "@/components/crm/leads/LeadFormModal";
import LeadProfileCard from "@/components/crm/leads/LeadProfileCard";
import LeadTabs from "@/components/crm/leads/LeadTabs";
import FollowupFormModal from "@/components/crm/followups/FollowupFormModal";
import { Skeleton } from "@/components/common/Loader";

function extractItem(response) {
  return response?.data?.data || null;
}

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id;

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingLead, setSavingLead] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [savingFollowup, setSavingFollowup] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalKey, setLeadModalKey] = useState(0);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [followupModalOpen, setFollowupModalOpen] = useState(false);
  const [followupModalKey, setFollowupModalKey] = useState(0);
  const [editingFollowup, setEditingFollowup] = useState(null);

  const fetchLeadBundle = useCallback(async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      const [leadRes, notesRes, activitiesRes, followupsRes] = await Promise.all([
        api.get(`leads/${leadId}`),
        api.get(`notes/lead/${leadId}`),
        api.get(`activities/lead/${leadId}`),
        api.get(`followups?leadId=${leadId}`),
      ]);

      setLead(extractItem(leadRes));
      setNotes(extractArray(notesRes));
      setActivities(extractArray(activitiesRes));
      setFollowups(extractArray(followupsRes));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load lead profile");
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  const fetchNotes = useCallback(async () => {
    if (!leadId) return;
    try {
      const response = await api.get(`notes/lead/${leadId}`);
      setNotes(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to refresh notes");
    }
  }, [leadId]);

  const fetchFollowups = useCallback(async () => {
    if (!leadId) return;
    try {
      const response = await api.get(`followups?leadId=${leadId}`);
      setFollowups(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to refresh follow-ups");
    }
  }, [leadId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchLeadBundle();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchLeadBundle]);

  useEffect(() => {
    async function fetchUsers() {
      for (const path of ["users/tenant-users", "users"]) {
        try {
          const response = await api.get(path);
          setUsers(extractArray(response));
          return;
        } catch {
          setUsers([]);
        }
      }
    }

    fetchUsers();
  }, []);

  const openLeadModal = () => {
    setLeadModalKey((value) => value + 1);
    setLeadModalOpen(true);
  };

  const openAddFollowup = () => {
    setEditingFollowup(null);
    setFollowupModalKey((value) => value + 1);
    setFollowupModalOpen(true);
  };

  const openEditFollowup = (followup) => {
    setEditingFollowup(followup);
    setFollowupModalKey((value) => value + 1);
    setFollowupModalOpen(true);
  };

  const handleLeadUpdate = async (payload) => {
    if (!lead?._id) return;

    try {
      setSavingLead(true);
      const response = await api.patch(`leads/${lead._id}`, payload);
      setLead(extractItem(response));
      setLeadModalOpen(false);
      toast.success("Lead updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update lead");
    } finally {
      setSavingLead(false);
    }
  };

  const handleAddNote = async (note, reset) => {
    if (!leadId) return;

    try {
      setSavingNote(true);
      await api.post("notes/create", { leadId, note });
      toast.success("Note added successfully");
      reset?.();
      setNoteModalOpen(false);
      await fetchNotes();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleFollowupSubmit = async (payload) => {
    try {
      setSavingFollowup(true);
      if (editingFollowup?._id) {
        await api.patch(`followups/${editingFollowup._id}`, payload);
        toast.success("Follow-up updated");
      } else {
        await api.post("followups/create", payload);
        toast.success("Follow-up created successfully");
      }

      setFollowupModalOpen(false);
      await fetchFollowups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save follow-up");
    } finally {
      setSavingFollowup(false);
    }
  };

  const handleCompleteFollowup = async (followup) => {
    try {
      await api.patch(`followups/${followup?._id}/complete`);
      toast.success("Follow-up completed");
      await fetchFollowups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to complete follow-up");
    }
  };

  const handleCancelFollowup = async (followup) => {
    try {
      await api.patch(`followups/${followup?._id}/cancel`);
      toast.success("Follow-up cancelled");
      await fetchFollowups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to cancel follow-up");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Skeleton className="h-[620px]" />
        <Skeleton className="h-[620px]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <section className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A]">Lead not found</h1>
          <p className="mt-2 text-sm font-medium text-[#64748B]">The lead may have been deleted or is no longer available.</p>
          <button type="button" onClick={() => router.push("/leads")} className="mt-6 rounded-2xl bg-[#4DA8FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2E95F7]">
            Back to Leads
          </button>
        </div>
      </section>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="grid min-w-0 gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Link href="/leads" className="inline-flex items-center gap-2 text-sm text-[#64748B] transition hover:text-[#2E95F7]">
            <ArrowLeft size={17} />
            Back to leads
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Customer Profile</h1>
          <p className="mt-2 text-sm font-medium text-[#64748B]">Single source of truth for one customer.</p>
        </div>
        <button type="button" onClick={openLeadModal} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-4 text-sm font-semibold text-white transition hover:bg-[#2E95F7]">
          <Edit3 size={17} />
          Edit Lead
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <LeadProfileCard lead={lead} onAddFollowup={openAddFollowup} onAddNote={() => setNoteModalOpen(true)} />
        <LeadTabs
          lead={lead}
          notes={notes}
          activities={activities}
          followups={followups}
          onAddNote={() => setNoteModalOpen(true)}
          onAddFollowup={openAddFollowup}
          onEditFollowup={openEditFollowup}
          onCompleteFollowup={handleCompleteFollowup}
          onCancelFollowup={handleCancelFollowup}
        />
      </div>

      <LeadFormModal key={leadModalKey} open={leadModalOpen} mode="edit" lead={lead} users={users} saving={savingLead} onClose={() => setLeadModalOpen(false)} onSubmit={handleLeadUpdate} />
      <AddNoteModal open={noteModalOpen} saving={savingNote} onClose={() => setNoteModalOpen(false)} onSubmit={handleAddNote} />
      <FollowupFormModal
        key={followupModalKey}
        open={followupModalOpen}
        mode={editingFollowup ? "edit" : "create"}
        followup={editingFollowup}
        leads={[lead]}
        users={users}
        saving={savingFollowup}
        onClose={() => setFollowupModalOpen(false)}
        onSubmit={handleFollowupSubmit}
      />
    </motion.div>
  );
}
