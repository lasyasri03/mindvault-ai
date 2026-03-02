"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-2xl border border-emerald-300/40 bg-emerald-500/90 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur"
        >
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

