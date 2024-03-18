import styled from 'styled-components';
import { useCabins } from '~/features/cabins/useCabins';
import SalesChart from '~/features/dashboard/SalesChart';
import Stats from '~/features/dashboard/Stats';
import { useRecentBookings } from '~/features/dashboard/useRecentBookings';
import { useRecentStays } from '~/features/dashboard/useRecentStays';
import Spinner from '~/ui/Spinner';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading: isLoadingBooking } = useRecentBookings();
  const { confirmedStays, isLoading: isLoadingStays, numDays } = useRecentStays();
  const { cabins, isLoading: isLoadingCabins } = useCabins();

  if (isLoadingBooking || isLoadingStays || isLoadingCabins) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins?.length || 0}
      />
      <div>Today's activity</div>
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
