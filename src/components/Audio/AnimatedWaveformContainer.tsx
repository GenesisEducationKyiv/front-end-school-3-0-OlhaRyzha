import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedWaveformContainerProps {
  isVisible: boolean;
  className?: string;
}

const AnimatedWaveformContainer = forwardRef<
  HTMLDivElement,
  AnimatedWaveformContainerProps
>(({ isVisible, className }, ref) => (
  <motion.div
    ref={ref}
    className={className}
    initial={{ opacity: 0, x: -40, scale: 0.95 }}
    animate={
      isVisible
        ? { opacity: 1, x: 0, scale: 1 }
        : { opacity: 0, x: -40, scale: 0.95 }
    }
    transition={{
      type: 'spring',
      stiffness: 48,
      damping: 14,
      mass: 0.7,
      duration: 0.85,
    }}
  />
));

export default AnimatedWaveformContainer;
