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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              'relative w-full bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden',
              maxWidth,
              className
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-text">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
