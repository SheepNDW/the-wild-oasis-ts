import type { SortField } from '~/features/bookings/BookingTableOperations';
import supabase from '~/services/supabase';
import { Tables } from '~/types/supabase';
import { PAGE_SIZE } from '~/utils/constant';
import { getToday } from '~/utils/helpers';
import { Cabin } from './apiCabins';

type Status = 'unconfirmed' | 'checked-in' | 'checked-out';
type QueryMethod = 'gte' | 'lte';
export interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  status: Status;
  totalPrice: number;
  cabins: { name: string };
  guests: { fullName: string; email: string };
}
export type Bookings = Booking[];

export async function getBookings({
  filter,
  sortBy,
  page,
}: {
  filter: { field: string; value: string; method?: QueryMethod } | null;
  sortBy: { field: SortField; direction: 'asc' | 'desc' };
  page: number;
}) {
  let query = supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)',
      { count: 'exact' }
    );

  if (filter !== null) {
    if (filter.method) {
      query = query[filter.method](filter.field, filter.value);
    } else {
      query = query.eq(filter.field, filter.value);
    }
  }

  if (sortBy) {
    query = query.order(sortBy.field, { ascending: sortBy.direction === 'asc' });
  }

  if (page) {
    const from = PAGE_SIZE * (page - 1);
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query.returns<Bookings>();

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return {
    data,
    count,
  };
}

export interface BookingDetail {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: Status;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string | null;
  cabinId: number;
  guestId: number;
  cabins: Cabin;
  guests: Guest;
}

interface Guest {
  id: number;
  email: string;
  fullName: string;
  created_at: string;
  nationalID: string;
  countryFlag: string | null;
  nationality: string;
  country: string;
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data as BookingDetail;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export interface BookingsAfterDate {
  created_at: string;
  totalPrice: number | null;
  extrasPrice: number | null;
}

export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data as BookingsAfterDate[];
}

// Returns all STAYS that are were created after the given date
export interface StaysAfterDate {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: string;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: number;
  guestId: number;
  guests: { fullName: string };
}

export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data as StaysAfterDate[];
}

export interface StaysTodayActivity {
  id: number;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: Status;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string | null;
  cabinId: number;
  guestId: number;
  guests: {
    fullName: string;
    countryFlag: string;
    nationality: string;
  };
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data as StaysTodayActivity[];
}

export type NewBooking = Omit<Tables<'bookings'>, 'id'>;

export async function updateBooking(id: number, obj: Partial<NewBooking>) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id: number) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
