"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/** Tweens to each new integer value; jumps instantly under reduced motion. */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(display, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion]);

  return (
    <span className={className}>
      {Math.round(display).toLocaleString("en-US")}
    </span>
  );
}
