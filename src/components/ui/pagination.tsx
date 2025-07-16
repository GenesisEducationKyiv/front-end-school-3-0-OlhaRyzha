import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from 'tracks-manager-ui';

export const Pagination = ({
  className,
  ...props
}: React.ComponentProps<'nav'>) => (
  <nav
    data-testid='pagination'
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-2', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('', className)}
    {...props}
  />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  variant?: ButtonProps['variant'];
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

export const PaginationLink = ({
  isActive,
  disabled,
  size = 'icon',
  className,
  ...props
}: PaginationLinkProps) => {
  const variant = isActive ? 'default' : 'paginationInactive';

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        buttonVariants({ variant, size }),
        'min-h-[20px] min-w-[20px] flex items-center justify-center',
        disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : '',
        className
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = ({
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    disabled={disabled}
    className='gap-1 pl-2.5'
    {...props}>
    <ChevronLeft className='h-4 w-4' />
    <span>Prev</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = ({
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    disabled={disabled}
    className='gap-1 pr-2.5'
    {...props}>
    <span>Next</span>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex items-center justify-center min-h-[20px] min-w-[20px] text-foreground',
      className
    )}
    {...props}>
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';
