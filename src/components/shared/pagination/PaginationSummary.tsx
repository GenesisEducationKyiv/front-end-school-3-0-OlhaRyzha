import { useAppSelector } from '@/store';
import { selectMeta } from '@/store/slices/table/tableSlice';

interface PaginationSummaryProps {
  label?: string;
}
const PaginationSummary = ({ label = 'tracks' }: PaginationSummaryProps) => {
  const totalItems = useAppSelector(selectMeta)?.total;

  return (
    <div className='flex items-center gap-2 shrink-0'>
      Total {label}: <b>{totalItems}</b>
    </div>
  );
};
export default PaginationSummary;
