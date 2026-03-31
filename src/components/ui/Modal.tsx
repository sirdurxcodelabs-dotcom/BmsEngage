import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className, maxWidth = 'max-w-lg' }: ModalProps) => {
  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        /* Full-screen overlay — flex centering, safe padding on all sides */
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              // Mobile: full-width bottom sheet with rounded top corners
              // sm+: centered card with max-width
              'relative w-full bg-card border border-white/10 shadow-2xl',
              'rounded-t-2xl sm:rounded-2xl',
              // Height: on mobile fills up to 92vh, on desktop caps at 90vh
              'max-h-[92vh] sm:max-h-[90vh]',
              'flex flex-col',
              maxWidth,
              className
            )}
          >
            {/* Header — always visible, never scrolls */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-text pr-4 leading-tight">{title}</h3>
              <button
                onClick={onClose}
                className="shrink-0 p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-6 text-text">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
