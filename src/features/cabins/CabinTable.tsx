import { useSearchParams } from 'react-router-dom';
import CabinRow from '~/features/cabins/CabinRow';
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
          data={filteredCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
