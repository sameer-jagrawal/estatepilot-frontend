"use client";

import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LazyLandingSection({
  children,
  className = "",
  placeholderClassName = "min-h-screen",
  name,
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const { ref } = useInView({
    rootMargin: "140px 0px",
    threshold: 0.04,
    triggerOnce: true,
    onChange: (visible) => {
      if (visible) setShouldRender(true);
    },
  });

  return (
    <section ref={ref} data-landing-section={name} className={className}>
      {shouldRender ? children : <div aria-hidden="true" className={placeholderClassName} />}
    </section>
  );
}
