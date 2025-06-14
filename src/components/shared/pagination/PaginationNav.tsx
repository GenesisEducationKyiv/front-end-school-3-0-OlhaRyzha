import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { META } from '@/constants/table.constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectMeta, updatePage } from '@/store/slices/table/tableSlice';
import { generatePageNumbers } from '@/utils/generatePageNumbers';

const PaginationNav = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages } = useAppSelector(selectMeta);

  const handlePageClick = (e: React.MouseEvent, page: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(updatePage(page));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            disabled={currentPage === META.page}
            onClick={(e) => handlePageClick(e, currentPage - 1)}
            data-testid='pagination-prev'
            aria-label='Previous page'
          />
        </PaginationItem>
        {generatePageNumbers(totalPages, currentPage).map((p, i) => (
          <PaginationItem key={String(p) + i}>
            {p === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href='#'
                isActive={p === currentPage}
                onClick={(e) => handlePageClick(e, p)}
                aria-label={`Page ${p}`}>
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href='#'
            disabled={currentPage >= totalPages}
            onClick={(e) => handlePageClick(e, currentPage + 1)}
            data-testid='pagination-next'
            aria-label='Next page'
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default PaginationNav;
