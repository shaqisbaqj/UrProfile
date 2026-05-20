"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const springCfg = { damping: 28, stiffness: 600, mass: 0.5 };
  const x = useSpring(mx, springCfg);
  const y = useSpring(my, springCfg);

  useEffect(() => {
    // Only show on devices with a true pointer (not touch)
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const attachHover = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    // Attach initially and re-attach on DOM changes
    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      observer.disconnect();
    };
  }, [mx, my, visible]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      {/* Outer ring */}
      <motion.div
        className="rounded-full border border-white/60 mix-blend-difference"
        animate={{
          width: hovered ? 44 : clicking ? 20 : 32,
          height: hovered ? 44 : clicking ? 20 : 32,
          opacity: 1,
        }}
        initial={{ width: 32, height: 32, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      {/* Inner dot */}
      <motion.div
        className="absolute inset-0 m-auto rounded-full bg-white mix-blend-difference"
        animate={{
          width: clicking ? 6 : 4,
          height: clicking ? 6 : 4,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
    </motion.div>
  );
}
