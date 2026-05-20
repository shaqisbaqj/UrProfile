"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Respect users who've already seen the intro this session
    const seen = sessionStorage.getItem("urprofile-intro");
    if (seen) { setShow(false); return; }

    const t = setTimeout(() => {
      sessionStorage.setItem("urprofile-intro", "1");
      setShow(false);
    }, 2200);

    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9998] bg-[#1C1A18] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Wordmark */}
          <motion.p
            className="font-display text-cream/90 text-3xl sm:text-4xl tracking-[0.15em] font-light"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            UrProfile
          </motion.p>

          {/* Thin line that extends */}
          <motion.div
            className="mt-8 h-px bg-ember/60"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
