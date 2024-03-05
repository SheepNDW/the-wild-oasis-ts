import { useSearchParams } from 'react-router-dom';
import CabinRow from '~/features/cabins/CabinRow';
import { SortField } from '~/features/cabins/CabinTableOperations';
import { useCabins } from '~/features/cabins/useCabins';
import Menus from '~/ui/Menus';
import Spinner from '~/ui/Spinner';
import Table from '~/ui/Table';

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const filterValue = searchParams.get('discount') ?? 'all';

  const filteredCabins = (cabins ?? []).filter((cabin) => {
    if (filterValue === 'all') return true;
    if (filterValue === 'no-discount') return cabin.discount === 0;
    if (filterValue === 'with-discount') return cabin.discount! > 0;
    return true;
  });

  const sortBy = searchParams.get('sortBy') ?? 'startDate-asc';
  const [sortByField, sortByOrder] = sortBy.split('-') as [SortField, 'asc' | 'desc'];
  const modifier = sortByOrder === 'asc' ? 1 : -1;

  const sortedCabins = filteredCabins.sort((a, b) => {
    if (typeof a[sortByField] === 'string') {
      const aField = a[sortByField] as string;
      const bField = b[sortByField] as string;
      return aField.localeCompare(bField) * modifier;
    } else {
      const aField = (a[sortByField] || 0) as number;
      const bField = (b[sortByField] || 0) as number;
      return (aField - bField) * modifier;
    }
  });

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
