import SortBy from '~/ui/SortBy';
import Filter from '~/ui/Filter';
import TableOperations from '~/ui/TableOperations';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'checked-out', label: 'Checked out' },
  { value: 'checked-in', label: 'Checked in' },
  { value: 'unconfirmed', label: 'Unconfirmed' },
];

const sortOptions = [
  { value: 'startDate-asc', label: 'Sort by date (earlier first)' },
  { value: 'startDate-desc', label: 'Sort by date (recent first)' },
  { value: 'totalPrice-asc', label: 'Sort by amount (low first)' },
  { value: 'totalPrice-desc', label: 'Sort by amount (high first)' },
];

export type SortField = 'startDate' | 'totalPrice';

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter filterField="status" options={filterOptions} />

      <SortBy options={sortOptions} />
    </TableOperations>
  );
}

export default BookingTableOperations;
