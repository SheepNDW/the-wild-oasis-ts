import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createEditCabin, type NewCabin } from '~/services/apiCabins';

export function useEditCabin() {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }: { newCabinData: NewCabin; id: number }) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin successfully edited');
      queryClient.invalidateQueries(['cabins']);
    },
    onError: (error: Error) => {
      toast.error('An error occurred: ' + error.message);
    },
  });

  return {
    isEditing,
    editCabin,
  };
}
