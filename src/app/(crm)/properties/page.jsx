"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, MapPin, Plus, Star, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import PropertyFilters from "@/components/crm/properties/PropertyFilters";
import PropertyFormModal from "@/components/crm/properties/PropertyFormModal";
import PropertyTable, { PropertyTableSkeleton } from "@/components/crm/properties/PropertyTable";
import PropertyStatusBadge, { formatPropertyLabel } from "@/components/crm/properties/PropertyStatusBadge";
import { createdByName, formatArea, formatPrice } from "@/components/crm/properties/PropertyCard";
import PropertyActivityTimeline from "@/components/crm/activity/PropertyActivityTimeline";

function extractArray(response) {
  const data = response?.data?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function extractItem(response) {
  return response?.data?.data || null;
}

function buildPropertyQuery({ search, propertyType, purpose, status, location, minPrice, maxPrice }) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (propertyType) params.append("propertyType", propertyType);
  if (purpose) params.append("purpose", purpose);
  if (status) params.append("status", status);
  if (location) params.append("location", location);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  const query = params.toString();
  return query ? `properties?${query}` : "properties";
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const path = buildPropertyQuery({ search: debouncedSearch, propertyType, purpose, status, location, minPrice, maxPrice });
      const response = await api.get(path);
      setProperties(extractArray(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, location, maxPrice, minPrice, propertyType, purpose, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchProperties();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchProperties]);

  const activeFilters = useMemo(
    () => [debouncedSearch, propertyType, purpose, status, location, minPrice, maxPrice].filter(Boolean).length,
    [debouncedSearch, location, maxPrice, minPrice, propertyType, purpose, status]
  );

  const openCreateModal = () => {
    setEditingProperty(null);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setModalKey((value) => value + 1);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingProperty(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);

      if (editingProperty?._id) {
        await api.patch(`properties/${editingProperty._id}`, payload);
        toast.success("Property updated successfully");
      } else {
        await api.post("properties/create", payload);
        toast.success("Property created successfully");
      }

      closeModal();
      await fetchProperties();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save property");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (property) => {
    const confirmed = window.confirm(`Delete ${property?.title || "this property"}?`);
    if (!confirmed || !property?._id) return;

    try {
      await api.delete(`properties/${property._id}`);
      toast.success("Property deleted successfully");
      await fetchProperties();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete property");
    }
  };

  const handleView = async (property) => {
    if (!property?._id) return;

    try {
      const response = await api.get(`properties/${property._id}`);
      setViewingProperty(extractItem(response) || property);
      setViewOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to fetch property");
      setViewingProperty(property);
      setViewOpen(true);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPropertyType("");
    setPurpose("");
    setStatus("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="grid min-w-0 max-w-full gap-6 overflow-x-hidden">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:flex-row lg:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF5FF] px-3 py-1.5 text-xs font-semibold text-[#2E95F7]">
            <Building2 size={15} />
            {activeFilters ? `${activeFilters} active filters` : "Property inventory"}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">Properties</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#64748B] sm:text-base">
            Manage your property inventory, availability, pricing, and locations.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2E95F7] hover:shadow-[0_16px_35px_rgba(77,168,255,0.25)]"
        >
          <Plus size={18} />
          Add Property
        </button>
      </motion.section>

      <PropertyFilters
        search={search}
        propertyType={propertyType}
        purpose={purpose}
        status={status}
        location={location}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onSearchChange={setSearch}
        onPropertyTypeChange={setPropertyType}
        onPurposeChange={setPurpose}
        onStatusChange={setStatus}
        onLocationChange={setLocation}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={resetFilters}
      />

      {loading ? (
        <PropertyTableSkeleton />
      ) : (
        <PropertyTable properties={properties} onView={handleView} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      <PropertyFormModal
        key={modalKey}
        open={modalOpen}
        mode={editingProperty ? "edit" : "create"}
        property={editingProperty}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <PropertyViewModal open={viewOpen} property={viewingProperty} onClose={() => setViewOpen(false)} onEdit={openEditModal} />
    </div>
  );
}

function PropertyViewModal({ open, property, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#0F172A]/35 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="my-6 w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] p-5 sm:p-6">
              <div>
                <div className="flex flex-wrap gap-2">
                  <PropertyStatusBadge value={property?.status} />
                  <PropertyStatusBadge value={property?.propertyType} type="propertyType" />
                  {property?.isFeatured ? <span className="inline-flex items-center gap-1 rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-semibold text-[#A78BFA]"><Star size={13} /> Featured</span> : null}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-[#0F172A]">{property?.title || "Property details"}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#64748B]">
                  <MapPin size={16} />
                  {property?.location || "No location"}
                  {property?.city ? `, ${property.city}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                aria-label="Close property details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex gap-2 border-b border-[#E2E8F0] pb-3">
                {["Overview", "Activity"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab ? "bg-[#EAF5FF] text-[#2E95F7]" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Overview" ? (
                <div className="mt-5 grid gap-5">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Info label="Property Code" value={property?.propertyCode || "-"} />
                    <Info label="Purpose" value={formatPropertyLabel(property?.purpose)} />
                    <Info label="Price" value={formatPrice(property?.price)} />
                    <Info label="Area" value={formatArea(property)} />
                    <Info label="Bedrooms" value={Number(property?.bedrooms || 0)} />
                    <Info label="Bathrooms" value={Number(property?.bathrooms || 0)} />
                    <Info label="Furnishing" value={formatPropertyLabel(property?.furnishing)} />
                    <Info label="Created By" value={createdByName(property)} />
                  </div>

                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Address</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#0F172A]">{property?.address || "No address added"}</p>
                  </div>

                  <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Description</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#0F172A]">{property?.description || "No description added"}</p>
                  </div>

                  <PillGroup title="Amenities" items={property?.amenities} empty="No amenities added" />
                  <PropertyImageGallery images={property?.images} />
                </div>
              ) : (
                <div className="mt-5 max-h-[56vh] overflow-y-auto pr-1">
                  <PropertyActivityTimeline propertyId={property?._id} />
                </div>
              )}

              <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="h-12 rounded-2xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(property);
                  }}
                  className="h-12 rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white hover:bg-[#2E95F7]"
                >
                  Edit Property
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PropertyImageGallery({ images }) {
  const list = Array.isArray(images) ? images.filter(Boolean) : [];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Images</p>
      {list.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((image, index) => (
            <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-36 w-full object-cover transition duration-200 hover:scale-[1.02]"
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-[#64748B]">No images added</p>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
      <p className="mt-2 break-words font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}

function PillGroup({ title, items, empty }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{title}</p>
      {list.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {list.map((item) => (
            <span key={item} className="rounded-full bg-white px-3 py-1 text-xs text-[#64748B] shadow-sm">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-[#64748B]">{empty}</p>
      )}
    </div>
  );
}
