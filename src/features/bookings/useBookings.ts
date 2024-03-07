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

  // PAGINATION
  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  const {
    isLoading,
    error,
    data: { data: bookings, count } = { data: [], count: 0 },
  } = useQuery({
    queryKey: ['bookings', filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  return {
    isLoading,
    error,
    bookings,
    count,
  };
}
