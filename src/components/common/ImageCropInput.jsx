"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export default function ImageCropInput({
  label = "Image",
  value = "",
  onChange,
  aspect = 1,
  outputWidth = 512,
  outputHeight,
  optionalText = "Optional",
  rounded = "rounded-2xl",
}) {
  const inputRef = useRef(null);
  const [source, setSource] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  const previewHeight = aspect === 1 ? "h-40" : "h-36";

  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSource(dataUrl);
      setZoom(1);
      setX(50);
      setY(50);
      setCropOpen(true);
    } catch {
      toast.error("Unable to read selected image");
    }
  };

  const saveCrop = async () => {
    try {
      const image = await loadImage(source);
      const canvas = document.createElement("canvas");
      const width = outputWidth;
      const height = outputHeight || Math.round(outputWidth / aspect);
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.fillStyle = "#F8FAFC";
      context.fillRect(0, 0, width, height);

      const baseScale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const scale = baseScale * zoom;
      const renderWidth = image.naturalWidth * scale;
      const renderHeight = image.naturalHeight * scale;
      const offsetX = (width - renderWidth) * (x / 100);
      const offsetY = (height - renderHeight) * (y / 100);

      context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
      onChange(canvas.toDataURL("image/jpeg", 0.86));
      setCropOpen(false);
      toast.success("Image selected");
    } catch {
      toast.error("Unable to crop image");
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
        <span className="text-xs font-semibold text-[#94A3B8]">{optionalText}</span>
      </div>

      <div className={`relative overflow-hidden border border-dashed border-[#CBD5E1] bg-[#F8FAFC] ${rounded}`}>
        {value ? (
          <div
            className={`${previewHeight} bg-cover bg-center`}
            style={{ backgroundImage: `url(${value})` }}
            aria-label={`${label} preview`}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`${previewHeight} grid w-full place-items-center text-[#64748B] transition hover:bg-white`}
          >
            <span className="grid justify-items-center gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#2E95F7] shadow-sm">
                <ImagePlus size={22} />
              </span>
              <span className="text-sm font-semibold">Select image</span>
            </span>
          </button>
        )}

        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#2E95F7] text-white shadow-[0_12px_30px_rgba(46,149,247,0.28)] transition hover:bg-[#1C75C9]"
            aria-label={value ? "Change image" : "Add image"}
          >
            <Plus size={18} />
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#DC2626] shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:bg-[#FEF2F2]"
              aria-label="Remove image"
            >
              <Trash2 size={17} />
            </button>
          ) : null}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={selectFile} className="hidden" />

      <AnimatePresence>
        {cropOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-[#0F172A]/45 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">Position image</h2>
                  <p className="mt-1 text-sm text-[#64748B]">Adjust the selected area before saving.</p>
                </div>
                <button type="button" onClick={() => setCropOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[#64748B]" aria-label="Close crop editor">
                  <X size={17} />
                </button>
              </div>

              <div
                className={`mt-5 w-full overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] ${rounded}`}
                style={{ aspectRatio: String(aspect) }}
              >
                <div
                  className="h-full w-full bg-no-repeat"
                  style={{
                    backgroundImage: `url(${source})`,
                    backgroundSize: `${zoom * 100}% auto`,
                    backgroundPosition: `${x}% ${y}%`,
                  }}
                />
              </div>

              <div className="mt-5 grid gap-4">
                <Slider label="Zoom" min="1" max="3" step="0.05" value={zoom} onChange={(value) => setZoom(Number(value))} />
                <Slider label="Horizontal" min="0" max="100" step="1" value={x} onChange={(value) => setX(Number(value))} />
                <Slider label="Vertical" min="0" max="100" step="1" value={y} onChange={(value) => setY(Number(value))} />
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setCropOpen(false)} className="h-11 rounded-2xl border border-[#E2E8F0] px-5 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC]">
                  Cancel
                </button>
                <button type="button" onClick={saveCrop} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2E95F7] px-5 text-sm font-semibold text-white transition hover:bg-[#1C75C9]">
                  <Save size={16} />
                  Use image
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, onChange, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#0F172A]">
      <span className="flex justify-between gap-3">
        {label}
        <span className="text-xs text-[#94A3B8]">{Number(value).toFixed(label === "Zoom" ? 2 : 0)}</span>
      </span>
      <input type="range" value={value} onChange={(event) => onChange(event.target.value)} className="accent-[#2E95F7]" {...props} />
    </label>
  );
}
