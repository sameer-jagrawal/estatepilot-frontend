"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useInView } from "react-intersection-observer";

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
  const { ref, inView } = useInView({
    threshold: 0.18,
    triggerOnce: once,
  });

  const setRefs = (node) => {
    elementRef.current = node;
    ref(node);
  };

  useEffect(() => {
    if (!elementRef.current || !inView) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(elementRef.current, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" });
      return;
    }

    gsap.fromTo(
      elementRef.current,
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
  }, [blur, delay, inView, rotate, scale, x, y]);

  return (
    <div ref={setRefs} className={className}>
      {children}
    </div>
  );
}
