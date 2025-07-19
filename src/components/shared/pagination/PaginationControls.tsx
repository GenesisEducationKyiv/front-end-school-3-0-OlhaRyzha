import type { FC } from 'react';
import PaginationSummary from './PaginationSummary';
import PaginationNav from './PaginationNav';
import PaginationLimitSelect from './PaginationLimitSelect';

interface PaginationControlsProps {
  label?: string;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  label = 'tracks',
}) => (
  <div className='flex items-center justify-between py-3 text-sm text-muted-foreground'>
    <PaginationSummary label={label} />
    <PaginationNav />
    <PaginationLimitSelect />
  </div>
);
export default PaginationControls;
