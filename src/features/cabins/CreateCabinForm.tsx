import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createCabin, type NewCabin } from '~/services/apiCabins';

import Button from '~/ui/Button';
import FileInput from '~/ui/FileInput';
import Form from '~/ui/Form';
import Input from '~/ui/Input';
import Textarea from '~/ui/Textarea';
import FormRow from '~/ui/FormRow';

type FormValues = NewCabin & { image: FileList };

function CreateCabinForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, getValues, formState } = useForm<FormValues>();
  const { errors } = formState;

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      queryClient.invalidateQueries(['cabins']);
      reset();
    },
    onError: (error: Error) => {
      toast.error('An error occurred: ' + error.message);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate({ ...data, image: data.image[0] });
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
          disabled={isCreating}
          {...register('name', {
            required: 'Cabin name is required',
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
            required: 'Cabin photo is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button color="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Edit cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
