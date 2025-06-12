import { TABLE_SIZES } from '@/constants/table.constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectMeta, updateLimit } from '@/store/slices/table/tableSlice';

const PaginationLimitSelect = () => {
  const dispatch = useAppDispatch();
  const { limit } = useAppSelector(selectMeta);
  return (
    <select
      value={limit}
      onChange={(e) => dispatch(updateLimit(Number(e.target.value)))}
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
};
export default PaginationLimitSelect;
