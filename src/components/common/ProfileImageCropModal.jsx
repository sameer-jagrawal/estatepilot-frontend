"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const CROP_SIZE = 280;
const OUTPUT_SIZE = 512;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export default function ProfileImageCropModal({ open, imageUrl, onCancel, onSave }) {
  const frameRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, imageX: 0, imageY: 0 });
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const baseScale = useMemo(() => {
    return Math.max(CROP_SIZE / imageSize.width, CROP_SIZE / imageSize.height);
  }, [imageSize.height, imageSize.width]);

  const displaySize = useMemo(
    () => ({
      width: imageSize.width * baseScale * zoom,
      height: imageSize.height * baseScale * zoom,
    }),
    [baseScale, imageSize.height, imageSize.width, zoom]
  );

  const clampPosition = (nextPosition, nextZoom = zoom) => {
    const nextDisplayWidth = imageSize.width * baseScale * nextZoom;
    const nextDisplayHeight = imageSize.height * baseScale * nextZoom;
    const maxX = Math.max(0, (nextDisplayWidth - CROP_SIZE) / 2);
    const maxY = Math.max(0, (nextDisplayHeight - CROP_SIZE) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPosition.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPosition.y)),
    };
  };

  useEffect(() => {
    if (!open || !imageUrl) return;

    let mounted = true;
    loadImage(imageUrl)
      .then((image) => {
        if (!mounted) return;
        setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      })
      .catch(() => toast.error("Unable to preview selected image"));

    return () => {
      mounted = false;
    };
  }, [imageUrl, open]);

  const startDrag = (event) => {
    event.preventDefault();
    const point = "touches" in event ? event.touches[0] : event;
    dragRef.current = {
      dragging: true,
      startX: point.clientX,
      startY: point.clientY,
      imageX: position.x,
      imageY: position.y,
    };
  };

  const moveDrag = (event) => {
    if (!dragRef.current.dragging) return;

    const point = "touches" in event ? event.touches[0] : event;
    const next = {
      x: dragRef.current.imageX + point.clientX - dragRef.current.startX,
      y: dragRef.current.imageY + point.clientY - dragRef.current.startY,
    };
    setPosition(clampPosition(next));
  };

  const endDrag = () => {
    dragRef.current.dragging = false;
  };

  const updateZoom = (value) => {
    const nextZoom = Number(value);
    setZoom(nextZoom);
    setPosition((current) => clampPosition(current, nextZoom));
  };

  const saveCrop = async () => {
    try {
      setSaving(true);
      const image = await loadImage(imageUrl);
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const context = canvas.getContext("2d");
      const scaleMultiplier = OUTPUT_SIZE / CROP_SIZE;
      const renderedWidth = displaySize.width * scaleMultiplier;
      const renderedHeight = displaySize.height * scaleMultiplier;
      const renderedX = (OUTPUT_SIZE - renderedWidth) / 2 + position.x * scaleMultiplier;
      const renderedY = (OUTPUT_SIZE - renderedHeight) / 2 + position.y * scaleMultiplier;

      context.save();
      context.beginPath();
      context.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
      context.clip();
      context.fillStyle = "#F8FAFC";
      context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      context.drawImage(image, renderedX, renderedY, renderedWidth, renderedHeight);
      context.restore();

      onSave(canvas.toDataURL("image/png"));
    } catch {
      toast.error("Unable to save cropped image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-[#0F172A]/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseMove={moveDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={moveDrag}
          onTouchEnd={endDrag}
        >
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">Adjust profile photo</h2>
                <p className="mt-1 text-sm text-[#64748B]">Move and zoom the image inside the circle.</p>
              </div>
              <button type="button" onClick={onCancel} className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[#64748B]" aria-label="Close profile image crop">
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid place-items-center">
              <div
                ref={frameRef}
                className="relative h-[280px] w-[280px] touch-none overflow-hidden rounded-full bg-[#EAF5FF] ring-4 ring-[#E2E8F0]"
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                role="application"
                aria-label="Circular profile crop area"
              >
                <img
                  src={imageUrl}
                  alt="Selected profile"
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none cursor-grab select-none active:cursor-grabbing"
                  style={{
                    width: `${displaySize.width}px`,
                    height: `${displaySize.height}px`,
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/95" />
              </div>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-[#0F172A]">
              <span className="flex justify-between gap-3">
                Zoom
                <span className="text-xs text-[#94A3B8]">{zoom.toFixed(2)}</span>
              </span>
              <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => updateZoom(event.target.value)} className="accent-[#2E95F7]" />
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onCancel} disabled={saving} className="h-11 rounded-2xl border border-[#E2E8F0] px-5 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] disabled:opacity-60">
                Cancel
              </button>
              <button type="button" onClick={saveCrop} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2E95F7] px-5 text-sm font-semibold text-white transition hover:bg-[#1C75C9] disabled:opacity-60">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? "Saving..." : "Apply"}
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
