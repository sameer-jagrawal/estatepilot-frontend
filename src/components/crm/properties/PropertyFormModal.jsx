"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { readFileAsDataUrl, validateImageFile } from "@/lib/imageValidation";

export const PROPERTY_TYPE_OPTIONS = ["flat", "villa", "plot", "commercial", "office", "shop"];
export const PURPOSE_OPTIONS = ["sale", "rent"];
export const AREA_UNIT_OPTIONS = ["sqft", "sqyd", "sqm"];
export const FURNISHING_OPTIONS = ["unfurnished", "semi-furnished", "fully-furnished"];
export const STATUS_OPTIONS = ["available", "sold", "rented", "blocked"];

const emptyProperty = {
  title: "",
  propertyType: "flat",
  purpose: "sale",
  price: "",
  area: "",
  areaUnit: "sqft",
  bedrooms: "",
  bathrooms: "",
  furnishing: "unfurnished",
  location: "",
  city: "",
  address: "",
  description: "",
  amenities: "",
  images: [],
  status: "available",
  isFeatured: false,
};

function textToList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value || "");
}

function createExistingImageItem(value, index) {
  return {
    id: `existing-${index}-${String(value).slice(0, 16)}`,
    value,
    previewUrl: value,
    objectUrl: false,
  };
}

function normalizeInitialImages(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(createExistingImageItem);
  return textToList(value).map(createExistingImageItem);
}

function normalizeImagePayload(images) {
  if (!Array.isArray(images)) return textToList(images);
  return images.map((image) => image?.value || image).filter(Boolean);
}

export function buildPropertyPayload(form) {
  return {
    ...form,
    price: Number(form.price || 0),
    area: Number(form.area || 0),
    bedrooms: Number(form.bedrooms || 0),
    bathrooms: Number(form.bathrooms || 0),
    amenities: textToList(form.amenities),
    images: normalizeImagePayload(form.images),
    isFeatured: Boolean(form.isFeatured),
  };
}

export default function PropertyFormModal({ open, mode = "create", property, saving = false, onClose, onSubmit }) {
  const initialForm = useMemo(
    () => ({
      title: property?.title || emptyProperty.title,
      propertyType: property?.propertyType || emptyProperty.propertyType,
      purpose: property?.purpose || emptyProperty.purpose,
      price: property?.price ?? "",
      area: property?.area ?? "",
      areaUnit: property?.areaUnit || emptyProperty.areaUnit,
      bedrooms: property?.bedrooms ?? "",
      bathrooms: property?.bathrooms ?? "",
      furnishing: property?.furnishing || emptyProperty.furnishing,
      location: property?.location || emptyProperty.location,
      city: property?.city || emptyProperty.city,
      address: property?.address || emptyProperty.address,
      description: property?.description || emptyProperty.description,
      amenities: listToText(property?.amenities),
      images: normalizeInitialImages(property?.images),
      status: property?.status || emptyProperty.status,
      isFeatured: Boolean(property?.isFeatured),
    }),
    [property]
  );

  const [form, setForm] = useState(initialForm);
  const [imageProcessing, setImageProcessing] = useState(false);
  const objectUrlsRef = useRef(new Set());

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addPropertyImages = async (files) => {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) return;

    const validFiles = [];

    selectedFiles.forEach((file) => {
      const error = validateImageFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        return;
      }
      validFiles.push(file);
    });

    if (!validFiles.length) return;

    try {
      setImageProcessing(true);
      const nextImages = await Promise.all(
        validFiles.map(async (file) => {
          const previewUrl = URL.createObjectURL(file);
          objectUrlsRef.current.add(previewUrl);
          return {
            id: `${file.name}-${file.lastModified}-${previewUrl}`,
            file,
            previewUrl,
            value: await readFileAsDataUrl(file),
            objectUrl: true,
          };
        })
      );

      setForm((current) => ({
        ...current,
        images: [...(Array.isArray(current.images) ? current.images : normalizeInitialImages(current.images)), ...nextImages],
      }));
    } catch {
      toast.error("Unable to process selected image");
    } finally {
      setImageProcessing(false);
    }
  };

  const removePropertyImage = (index) => {
    setForm((current) => {
      const currentImages = Array.isArray(current.images) ? current.images : normalizeInitialImages(current.images);
      const removed = currentImages[index];

      if (removed?.objectUrl && removed.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
        objectUrlsRef.current.delete(removed.previewUrl);
      }

      return {
        ...current,
        images: currentImages.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(buildPropertyPayload(form));
  };

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
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="my-6 w-full max-w-5xl rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">{mode === "edit" ? "Edit Property" : "Add Property"}</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">Manage pricing, availability, location, and inventory details.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Title" value={form.title} onChange={(value) => updateField("title", value)} required />
                <Select label="Property Type" value={form.propertyType} options={PROPERTY_TYPE_OPTIONS} onChange={(value) => updateField("propertyType", value)} />
                <Select label="Purpose" value={form.purpose} options={PURPOSE_OPTIONS} onChange={(value) => updateField("purpose", value)} />
                <Field label="Price" type="number" value={form.price} onChange={(value) => updateField("price", value)} required />
                <Field label="Area" type="number" value={form.area} onChange={(value) => updateField("area", value)} required />
                <Select label="Area Unit" value={form.areaUnit} options={AREA_UNIT_OPTIONS} onChange={(value) => updateField("areaUnit", value)} />
                <Field label="Bedrooms" type="number" value={form.bedrooms} onChange={(value) => updateField("bedrooms", value)} />
                <Field label="Bathrooms" type="number" value={form.bathrooms} onChange={(value) => updateField("bathrooms", value)} />
                <Select label="Furnishing" value={form.furnishing} options={FURNISHING_OPTIONS} onChange={(value) => updateField("furnishing", value)} />
                <Field label="Location" value={form.location} onChange={(value) => updateField("location", value)} required />
                <Field label="City" value={form.city} onChange={(value) => updateField("city", value)} />
                <Select label="Status" value={form.status} options={STATUS_OPTIONS} onChange={(value) => updateField("status", value)} />
                <label className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) => updateField("isFeatured", event.target.checked)}
                    className="h-4 w-4 accent-[#4DA8FF]"
                  />
                  <span className="text-sm font-semibold text-[#0F172A]">Featured Property</span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextArea label="Address" value={form.address} onChange={(value) => updateField("address", value)} />
                <TextArea label="Description" value={form.description} onChange={(value) => updateField("description", value)} />
                <TextArea label="Amenities" value={form.amenities} onChange={(value) => updateField("amenities", value)} placeholder="lift, parking, gym" />
                <div className="md:col-span-2">
                  <PropertyImageInput
                    images={Array.isArray(form.images) ? form.images : normalizeInitialImages(form.images)}
                    onAdd={addPropertyImages}
                    onRemove={removePropertyImage}
                    processing={imageProcessing}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#4DA8FF] bg-[#4DA8FF] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2E95F7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader label="Saving" className="text-white" spinnerClassName="border-white/40 border-t-white" /> : mode === "edit" ? "Save Changes" : "Create Property"}
                </button>
              </div>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PropertyImageInput({ images, onAdd, onRemove, processing }) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#0F172A]">Property Images</span>
        <span className="text-xs font-semibold text-[#94A3B8]">Optional</span>
      </div>
      <label className="grid min-h-36 cursor-pointer place-items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center transition hover:bg-white">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            onAdd(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="grid justify-items-center gap-2">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#2E95F7] shadow-sm">
            {processing ? <Loader2 className="animate-spin" size={22} /> : <ImagePlus size={22} />}
          </span>
          <span className="text-sm font-semibold text-[#0F172A]">{processing ? "Processing images..." : "Select images from device"}</span>
          <span className="text-xs font-medium text-[#64748B]">Selected images appear below and can be changed later from edit.</span>
        </span>
      </label>
      {images.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id || `${image.previewUrl}-${index}`} className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <img
                src={image.previewUrl || image.value}
                alt="Property preview"
                loading="lazy"
                decoding="async"
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white text-[#DC2626] opacity-95 shadow-sm transition hover:bg-[#FEF2F2]"
                aria-label="Remove property image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
      />
    </label>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold capitalize text-[#0F172A] outline-none transition focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder={placeholder}
        className="resize-none rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#4DA8FF] focus:bg-white focus:ring-4 focus:ring-[#4DA8FF]/15"
      />
    </label>
  );
}
