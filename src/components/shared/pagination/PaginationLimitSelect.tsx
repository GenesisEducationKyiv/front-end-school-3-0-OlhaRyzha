import { TABLE_SIZES } from '@/constants/table.constants';

interface PaginationLimitSelectProps {
  limit: number;
  onChange: (limit: number) => void;
}
const PaginationLimitSelect = ({
  limit,
  onChange,
}: PaginationLimitSelectProps) => (
  <select
    value={limit}
    onChange={(e) => onChange(Number(e.target.value))}
    className='text-sm p-1 border rounded'
    aria-label='Rows per page'>
    {TABLE_SIZES.map((sz) => (
      <option
        key={sz}
        value={sz}>
        {sz} / page
      </option>
    ))}
  </select>
);
export default PaginationLimitSelect;
