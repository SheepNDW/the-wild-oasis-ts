import styled from 'styled-components';
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
  const { stays, isLoading: isLoadingStays } = useRecentStays();

  if (isLoadingBooking || isLoadingStays) return <Spinner />;

  console.log(bookings);

  return (
    <StyledDashboardLayout>
      <div>Statistics</div>
      <div>Today's activity</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
