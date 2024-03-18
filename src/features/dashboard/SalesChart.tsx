import { eachDayOfInterval, format, subDays } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';
import { useDarkMode } from '~/context/useDarkMode';
import DashboardBox from '~/features/dashboard/DashboardBox';
import { BookingsAfterDate } from '~/services/apiBookings';
import Heading from '~/ui/Heading';

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ bookings, numDays }: { bookings: BookingsAfterDate[]; numDays: number }) {
  const { isDarkMode } = useDarkMode();

  const bookingsByDate = new Map<string, BookingsAfterDate[]>();
  bookings.forEach((booking) => {
    const dateKey = format(new Date(booking.created_at), 'yyyy-MM-dd');
    if (!bookingsByDate.has(dateKey)) {
      bookingsByDate.set(dateKey, []);
    }
    bookingsByDate.get(dateKey)!.push(booking);
  });

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dailyBookings = bookingsByDate.get(dateKey) ?? [];
    const totalSales = dailyBookings.reduce((acc, cur) => acc + (cur.totalPrice ?? 0), 0);
    const extrasSales = dailyBookings.reduce((acc, cur) => acc + (cur.extrasPrice ?? 0), 0);

    return {
      label: format(date, 'MMM dd'),
      totalSales,
      extrasSales,
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: '#4f46e5', fill: '#4f46e5' },
        extrasSales: { stroke: '#22c55e', fill: '#22c55e' },
        text: '#e5e7eb',
        background: '#18212f',
      }
    : {
        totalSales: { stroke: '#4f46e5', fill: '#c7d2fe' },
        extrasSales: { stroke: '#16a34a', fill: '#dcfce7' },
        text: '#374151',
        background: '#fff',
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates[0], 'MMM dd yyyy')} &mdash;{' '}
        {format(allDates[allDates.length - 1], 'MMM dd yyyy')}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis dataKey="label" tick={{ fill: colors.text }} tickLine={{ stroke: colors.text }} />
          <YAxis unit="$" tick={{ fill: colors.text }} tickLine={{ stroke: colors.text }} />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total sales"
            unit="$"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="Extras sales"
            unit="$"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
