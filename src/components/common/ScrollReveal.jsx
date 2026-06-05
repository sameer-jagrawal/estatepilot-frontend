"use client";

import { useEffect, useRef } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  x = 0,
  y = 28,
  scale = 1,
  rotate = 0,
  blur = 0,
  once = true,
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;

    let context;
    let cancelled = false;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = async () => {
      if (cancelled) return;

      if (prefersReducedMotion) {
        node.style.opacity = "1";
        node.style.transform = "none";
        node.style.filter = "blur(0px)";
        return;
      }

      const { gsap } = await import("gsap");
      if (cancelled) return;

      context = gsap.context(() => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, x, y, scale, rotate, filter: `blur(${blur}px)` },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            delay,
            duration: 1,
            ease: "back.out(1.35)",
          }
        );
      }, node);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        if (once) observer.disconnect();
      },
      { threshold: 0.18 }
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      context?.revert();
    };
  }, [blur, delay, once, rotate, scale, x, y]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
