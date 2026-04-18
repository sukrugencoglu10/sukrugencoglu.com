"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  color: string;
}

export default function ServiceModal({ isOpen, onClose, children, title, color }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{ maxHeight: "92vh" }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div
              style={{ background: `${color}12`, borderBottom: `3px solid ${color}` }}
              className="flex items-center justify-between px-5 py-4"
            >
              <span
                style={{ color }}
                className="text-sm font-bold uppercase tracking-wider"
              >
                {title}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-lg font-light text-ink transition-colors cursor-pointer border-none"
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 60px)" }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
