import type { Variants } from 'framer-motion';

/**
 * Smooth “SaaS-style” spring fade-up animation
 * (used for cards, sections, text blocks)
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      mass: 0.9,
    },
  },
};

/**
 * Simple fade-in (no movement)
 * (good for overlays, modals, subtle UI changes)
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: 'easeOut' as const,
    },
  },
};

/**
 * Container animation for staggered children
 * (use on grids, sections, lists)
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};