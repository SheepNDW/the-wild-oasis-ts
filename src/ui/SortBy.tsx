import { useSearchParams } from 'react-router-dom';
import Select from '~/ui/Select';

function SortBy({ options }: { options: { value: string; label: string }[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSortBy = searchParams.get('sortBy') ?? '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set('sortBy', e.target.value);
    setSearchParams(searchParams);
  }

  return <Select options={options} value={currentSortBy} type="white" onChange={handleChange} />;
}

export default SortBy;
