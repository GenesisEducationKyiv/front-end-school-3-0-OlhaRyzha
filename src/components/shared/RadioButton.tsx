import { cn } from '@/lib/utils';

interface RadioButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const RadioButton = ({
  active = false,
  disabled = false,
  children,
  className,
  onClick,
}: RadioButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'radio-btn',
      active ? 'active' : 'inactive',
      disabled && 'disabled',
      className
    )}>
    {children}
  </button>
);

export default RadioButton;
