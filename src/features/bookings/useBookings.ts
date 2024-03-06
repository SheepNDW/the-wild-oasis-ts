import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { SortField } from '~/features/bookings/BookingTableOperations';
import { getBookings } from '~/services/apiBookings';

export function useBookings() {
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get('status');
  const filter =
    !filterValue || filterValue === 'all' ? null : { field: 'status', value: filterValue };

  // SORT
  const sortValue = searchParams.get('sortBy') || 'startDate-asc';
  const [field, direction] = sortValue.split('-') as [SortField, 'asc' | 'desc'];
  const sortBy = { field, direction };

  const {
    isLoading,
    error,
    data: bookings,
  } = useQuery({
    queryKey: ['bookings', filter, sortBy],
    queryFn: () => getBookings({ filter, sortBy }),
  });

  return {
    isLoading,
    error,
    bookings,
  };
}
