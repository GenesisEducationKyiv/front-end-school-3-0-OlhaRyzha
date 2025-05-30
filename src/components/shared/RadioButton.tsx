import { cn } from '@/lib/utils';
const RadioButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'px-3 py-1 text-sm border rounded transition-colors',
      active
        ? 'bg-gray-100 border-black font-medium'
        : 'border-gray-300 hover:bg-gray-50'
    )}>
    {children}
  </button>
);
export default RadioButton;
