import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Stat from '~/features/dashboard/Stat';
import type { BookingsAfterDate, StaysAfterDate } from '~/services/apiBookings';
import { formatCurrency } from '~/utils/helpers';

function Stats({
  bookings,
  confirmedStays,
  numDays,
  cabinCount,
}: {
  bookings: BookingsAfterDate[];
  confirmedStays: StaysAfterDate[];
  numDays: number;
  cabinCount: number;
}) {
  const numBookings = bookings.length;
  const sales = bookings.reduce((acc, booking) => acc + (booking.totalPrice || 0), 0);
  const checkedIns = confirmedStays.length;

  // num checked-in nights / all available nights (num cabins * num days)
  const occupation = confirmedStays.reduce((acc, stay) => acc + stay.numNights, 0);
  const totalNights = cabinCount * numDays;
  const occupancyRate = `${Math.round((occupation / totalNights) * 100)}%`;

  return (
    <>
      <Stat title="bookings" color="blue" icon={<HiOutlineBriefcase />} value={numBookings} />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat title="Check ins" color="indigo" icon={<HiOutlineCalendarDays />} value={checkedIns} />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={occupancyRate}
      />
    </>
  );
}

export default Stats;
