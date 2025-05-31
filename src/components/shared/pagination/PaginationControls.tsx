import type { FC } from 'react';
import PaginationSummary from './PaginationSummary';
import PaginationNav from './PaginationNav';
import PaginationLimitSelect from './PaginationLimitSelect';

interface PaginationControlsProps {
  totalItems: number;
  currentPage: number;
  handlePageChange: (page: number | string) => void;
  totalPages: number;
  handleLimitChange: (limit: number) => void;
  limit: number;
  label?: string;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  totalItems,
  currentPage,
  handlePageChange,
  totalPages,
  handleLimitChange,
  limit,
  label = 'tracks',
}) => (
  <div className='flex items-center justify-between py-3 text-sm text-muted-foreground'>
    <PaginationSummary
      totalItems={totalItems}
      label={label}
    />
    <PaginationNav
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
    <PaginationLimitSelect
      limit={limit}
      onChange={handleLimitChange}
    />
  </div>
);
export default PaginationControls;
