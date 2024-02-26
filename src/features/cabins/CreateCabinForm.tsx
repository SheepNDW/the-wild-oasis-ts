import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createEditCabin, type Cabin, type NewCabin } from '~/services/apiCabins';

import Button from '~/ui/Button';
import FileInput from '~/ui/FileInput';
import Form from '~/ui/Form';
import FormRow from '~/ui/FormRow';
import Input from '~/ui/Input';
import Textarea from '~/ui/Textarea';

type FormValues = NewCabin & { image: FileList };

function CreateCabinForm({ cabinToEdit = {} as Cabin }: { cabinToEdit: Cabin }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, getValues, formState } = useForm<FormValues>({
    defaultValues: isEditSession ? (editValues as FormValues) : {},
  });
  const { errors } = formState;

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries(['cabins']);
      reset();
    },
    onError: (error: Error) => {
      toast.error('An error occurred: ' + error.message);
    },
  });

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }: { newCabinData: NewCabin; id: number }) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin successfully edited');
      queryClient.invalidateQueries(['cabins']);
      reset();
    },
    onError: (error: Error) => {
      toast.error('An error occurred: ' + error.message);
    },
  });

  const isWorking = isCreating || isEditing;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isEditSession) {
      editCabin({
        newCabinData: { ...data, image },
        id: editId,
      });
    } else {
      createCabin({ ...data, image: data.image[0] });
    }
  };

  const onError: SubmitErrorHandler<FormValues> = (_errors) => {
    // console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', {
            required: 'Cabin name is required',
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'Maximum capacity is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'Regular price is required',
            min: { value: 1, message: 'Regular price should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register('discount', {
            required: 'Discount is required',
            validate: (value) => {
              const regularPrice = Number(getValues().regularPrice ?? 0);
              return value! <= regularPrice || 'Discount should be less than regular price';
            },
          })}
        />
      </FormRow>

      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', {
            required: 'Description is required',
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', {
            required: isEditSession ? false : 'Cabin photo is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button color="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Edit cabin' : 'Create new cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
