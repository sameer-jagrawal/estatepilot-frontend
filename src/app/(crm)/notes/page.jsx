"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { NotebookPen, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import NoteDetailDrawer from "@/components/crm/notes/NoteDetailDrawer";
import NoteFilters from "@/components/crm/notes/NoteFilters";
import NoteFormModal from "@/components/crm/notes/NoteFormModal";
import NoteSummaryCards from "@/components/crm/notes/NoteSummaryCards";
import NoteTable, { NoteTableSkeleton } from "@/components/crm/notes/NoteTable";

const tabs = [
  { id: "all", label: "All Notes" },
  { id: "mine", label: "My Notes" },
  { id: "recent", label: "Recent" },
  { id: "important", label: "Important" },
];

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notes)) return data.notes;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function extractObject(response) {
  return response?.data?.data || response?.data?.note || response?.data || null;
}

function getUserId(user) {
  return user?._id || user?.id || user?.userId || "";
}

function buildNotesQuery({ search, leadId, createdBy, date, sort, activeTab, currentUserId }) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (leadId) params.append("leadId", leadId);
  if (date) params.append("date", date);
  if (sort) params.append("sort", sort);

  if (activeTab === "mine" && currentUserId) {
    params.append("createdBy", currentUserId);
  } else if (createdBy) {
    params.append("createdBy", createdBy);
  }

  if (activeTab === "important") {
    params.append("isImportant", "true");
  }

  const query = params.toString();
  return query ? `notes?${query}` : "notes";
}

function isRecent(note) {
  if (!note?.createdAt) return false;
  const created = new Date(note.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created <= 7 * 24 * 60 * 60 * 1000;
}

function EmptyNotes({ onAdd }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_16px_45px_rgba(15,23,42,0.05)]"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF5FF] text-[#2E95F7]">
        <NotebookPen size={25} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[#0F172A]">No notes found</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
        Create your first lead note or internal comment.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#4DA8FF] px-5 text-sm font-semibold text-white transition hover:bg-[#2E95F7]"
      >
        <Plus size={18} />
        Add Note
      </button>
    </motion.section>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [leadId, setLeadId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("recent");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingNote, setEditingNote] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const currentUserId = getUserId(currentUser);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const path = buildNotesQuery({
        search: debouncedSearch,
        leadId,
        createdBy,
        date,
        sort,
        activeTab,
        currentUserId,
      });
      const response = await api.get(path);
      setNotes(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, createdBy, currentUserId, date, debouncedSearch, leadId, sort]);

  useEffect(() => {
    const timer = window.setTimeout(fetchNotes, 0);
    return () => window.clearTimeout(timer);
  }, [fetchNotes]);

  useEffect(() => {
    async function fetchSupportingData() {
      try {
        const [leadsResponse, usersResponse, meResponse] = await Promise.allSettled([
          api.get("leads"),
          api.get("users"),
          api.get("auth/me"),
        ]);

        if (leadsResponse.status === "fulfilled") setLeads(extractArray(leadsResponse.value));
        if (usersResponse.status === "fulfilled") setUsers(extractArray(usersResponse.value));
        if (meResponse.status === "fulfilled") setCurrentUser(extractObject(meResponse.value));
      } catch {
        setLeads([]);
        setUsers([]);
      }
    }

    fetchSupportingData();
  }, []);

  const stats = useMemo(() => {
    const userId = currentUserId;

    return {
      total: notes.length,
      mine: notes.filter((note) => {
        const creatorId = note?.userId?._id || note?.userId || note?.createdBy?._id;
        return userId && String(creatorId) === String(userId);
      }).length,
      recent: notes.filter(isRecent).length,
      important: notes.filter((note) => note?.isImportant).length,
    };
  }, [currentUserId, notes]);

  const totalActiveFilters = useMemo(
    () => [debouncedSearch, leadId, createdBy, date, activeTab !== "all" ? activeTab : ""].filter(Boolean).length,
    [activeTab, createdBy, date, debouncedSearch, leadId]
  );

  const openCreateModal = () => {
    setEditingNote(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingNote(null);
  };

  const openDrawer = async (note) => {
    try {
      const response = await api.get(`notes/${note?._id}`);
      setSelectedNote(extractObject(response) || note);
    } catch {
      setSelectedNote(note);
    } finally {
      setDrawerOpen(true);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingNote?._id) {
        await api.patch(`notes/${editingNote._id}`, payload);
        toast.success("Note updated successfully");
      } else {
        await api.post("notes/create", payload);
        toast.success("Note created successfully");
      }

      closeModal();
      await fetchNotes();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note) => {
    const confirmed = window.confirm("Delete this note?");
    if (!confirmed || !note?._id) return;

    try {
      await api.delete(`notes/${note._id}`);
      toast.success("Note deleted successfully");
      await fetchNotes();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete note");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setLeadId("");
    setCreatedBy("");
    setDate("");
    setSort("recent");
    setActiveTab("all");
  };

  return (
    <div className="grid gap-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
            <NotebookPen size={15} />
            {totalActiveFilters ? `${totalActiveFilters} active filters` : "Customer intelligence"}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Notes</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
            Manage customer notes, internal comments, and important lead insights.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] hover:shadow-[0_16px_35px_rgba(77,168,255,0.25)]"
        >
          <Plus size={18} />
          Add Note
        </button>
      </motion.section>

      <NoteSummaryCards stats={stats} />

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`h-11 shrink-0 rounded-2xl px-4 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-[#EAF5FF] text-[#2E95F7]"
                : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <NoteFilters
        search={search}
        leadId={leadId}
        createdBy={createdBy}
        date={date}
        sort={sort}
        leads={leads}
        users={users}
        onSearchChange={setSearch}
        onLeadChange={setLeadId}
        onCreatedByChange={setCreatedBy}
        onDateChange={setDate}
        onSortChange={setSort}
        onReset={resetFilters}
      />

      {loading ? (
        <NoteTableSkeleton />
      ) : notes.length ? (
        <NoteTable notes={notes} onView={openDrawer} onEdit={openEditModal} onDelete={handleDelete} />
      ) : (
        <EmptyNotes onAdd={openCreateModal} />
      )}

      <NoteFormModal
        key={modalKey}
        open={modalOpen}
        mode={editingNote ? "edit" : "create"}
        note={editingNote}
        leads={leads}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <NoteDetailDrawer open={drawerOpen} note={selectedNote} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
