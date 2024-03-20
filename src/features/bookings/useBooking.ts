import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getBooking, type BookingDetail } from '~/services/apiBookings';

export function useBooking() {
  const { bookingId } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(Number(bookingId)),
    retry: false,
  });

  return {
    isLoading,
    error,
    booking: data as BookingDetail,
  };
}
