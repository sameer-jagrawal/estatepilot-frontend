"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProfileImageCropModal from "@/components/common/ProfileImageCropModal";
import { readFileAsDataUrl, validateImageFile } from "@/lib/imageValidation";

export default function ImageCropInput({
  label = "Image",
  value = "",
  onChange,
  optionalText = "Optional",
  rounded = "rounded-2xl",
  variant = "square",
}) {
  const inputRef = useRef(null);
  const objectUrlRef = useRef("");
  const [selectedPreview, setSelectedPreview] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const isCircle = variant === "circle";
  const previewClass = isCircle ? "h-40 w-40 rounded-full" : `h-40 w-full ${rounded}`;
  const displayPreview = selectedPreview || value;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
  };

  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    clearObjectUrl();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setSelectedPreview(previewUrl);

    if (isCircle) {
      setCropOpen(true);
      return;
    }

    try {
      setProcessing(true);
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
      toast.success("Image selected");
    } catch {
      toast.error("Unable to read selected image");
    } finally {
      setProcessing(false);
    }
  };

  const cancelCrop = () => {
    setCropOpen(false);
    setSelectedPreview("");
    clearObjectUrl();
  };

  const saveCrop = (dataUrl) => {
    onChange(dataUrl);
    setSelectedPreview("");
    setCropOpen(false);
    clearObjectUrl();
    toast.success("Profile image updated");
  };

  const removeImage = () => {
    setSelectedPreview("");
    clearObjectUrl();
    onChange("");
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
        <span className="text-xs font-semibold text-[#94A3B8]">{optionalText}</span>
      </div>

      <div className={isCircle ? "grid justify-items-start" : ""}>
        <button
          type="button"
          onClick={openFilePicker}
          className={`group relative grid ${previewClass} cursor-pointer place-items-center overflow-hidden border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B] transition hover:bg-white`}
          aria-label={`Upload ${label.toLowerCase()}`}
          title={`Upload ${label.toLowerCase()}`}
        >
          {displayPreview ? (
            <span
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${displayPreview})` }}
              aria-label={`${label} preview`}
            />
          ) : (
            <span className="grid justify-items-center gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#2E95F7] shadow-sm">
                <ImagePlus size={22} />
              </span>
              <span className="text-sm font-semibold">Select image</span>
            </span>
          )}

          <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#2E95F7] text-white shadow-[0_12px_30px_rgba(46,149,247,0.28)] transition hover:bg-[#1C75C9]">
            {processing ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          </span>
        </button>
      </div>

      {value ? (
        <button
          type="button"
          onClick={removeImage}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#FECACA] bg-white px-3 py-2 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2]"
        >
          <Trash2 size={15} />
          Remove image
        </button>
      ) : null}

      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={selectFile} className="hidden" />

      <ProfileImageCropModal open={cropOpen} imageUrl={selectedPreview} onCancel={cancelCrop} onSave={saveCrop} />
    </div>
  );
}
