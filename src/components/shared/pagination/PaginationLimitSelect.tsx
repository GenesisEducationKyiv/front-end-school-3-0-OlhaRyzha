import { TABLE_SIZES } from '@/constants/table.constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectMeta, updateLimit } from '@/store/slices/table/tableSlice';

const PaginationLimitSelect = () => {
  const dispatch = useAppDispatch();
  const { limit } = useAppSelector(selectMeta);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateLimit(Number(e.target.value)));
  };

  return (
    <select
      id='rows-per-page'
      name='rowsPerPage'
      value={limit}
      onChange={onChange}
      className='text-sm p-1 border rounded'
      aria-label='Rows per page'
      data-testid='rows-per-page-select'>
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
