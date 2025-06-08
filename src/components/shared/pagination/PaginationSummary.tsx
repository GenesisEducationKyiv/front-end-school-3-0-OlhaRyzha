interface PaginationSummaryProps {
  totalItems: number;
  label?: string;
}
const PaginationSummary = ({
  totalItems,
  label = 'tracks',
}: PaginationSummaryProps) => (
  <div className='flex items-center gap-2 shrink-0'>
    Total {label}: <b>{totalItems}</b>
  </div>
);
export default PaginationSummary;
