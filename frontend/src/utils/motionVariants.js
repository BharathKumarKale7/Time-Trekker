// Variant for a fade-up animation with staggered delay based on the item index `i`
export const fadeUp = {
  // Initial state: fully transparent and moved down by 24px
  hidden: { opacity: 0, y: 24 },

  // Visible state: fully opaque and moved to original position
  // Delay is multiplied by `i` to stagger animations of multiple elements
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,       // stagger delay based on index
      duration: 0.45,        // animation duration
      ease: "easeOut",       // easing function for smooth effect
    },
  }),
};

// Container variant to stagger child animations with a 0.12s gap
export const staggerContainer = {
  hidden: {},  // no changes to container on hidden
  visible: {
    transition: {
      staggerChildren: 0.12,  // children animate one after another with 0.12s delay
    },
  },
};
