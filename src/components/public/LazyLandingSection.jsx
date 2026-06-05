"use client";

import { useEffect, useRef, useState } from "react";

export default function LazyLandingSection({
  children,
  className = "",
  placeholderClassName = "min-h-screen",
  name,
}) {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || shouldRender) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      {
        rootMargin: "140px 0px",
        threshold: 0.04,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <section ref={sectionRef} data-landing-section={name} className={className}>
      {shouldRender ? children : <div aria-hidden="true" className={placeholderClassName} />}
    </section>
  );
}
