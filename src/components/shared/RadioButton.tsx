import { cn } from '@/lib/utils';

interface RadioButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
const RadioButton = ({ active, onClick, children }: RadioButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    className={cn('radio-btn', active ? 'active' : 'inactive')}>
    {children}
  </button>
);
export default RadioButton;
