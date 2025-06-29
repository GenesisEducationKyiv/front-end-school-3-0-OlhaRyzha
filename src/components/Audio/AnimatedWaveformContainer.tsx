import { forwardRef } from 'react';

interface AnimatedWaveformContainerProps {
  isVisible: boolean;
  className?: string;
}

import { cn } from '@/lib/utils';

const AnimatedWaveformContainer = forwardRef<
  HTMLDivElement,
  AnimatedWaveformContainerProps
>(({ isVisible, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      'transition-all duration-700 ease-out',
      isVisible
        ? 'opacity-100 translate-x-0 scale-100'
        : 'opacity-0 -translate-x-10 scale-95',
      className
    )}
  />
));

export default AnimatedWaveformContainer;
