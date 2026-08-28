import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, pageKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ 
          opacity: 0, 
          scale: 0.985, 
          filter: 'blur(8px)',
          y: 4
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          filter: 'blur(0px)',
          y: 0
        }}
        exit={{ 
          opacity: 0, 
          scale: 1.01, 
          filter: 'blur(10px)',
          y: -4
        }}
        transition={{ 
          duration: 1.1, 
          ease: [0.22, 1, 0.36, 1], // Gentle cinematic cubic bezier
        }}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
