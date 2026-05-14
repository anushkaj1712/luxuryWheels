/**
 * Framer Motion variants — staggered luxury reveals (GPU: opacity + transform only).
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.85, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
