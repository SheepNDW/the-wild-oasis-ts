import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCreateCabin } from '~/features/cabins/useCreateCabin';
import { useEditCabin } from '~/features/cabins/useEditCabin';
import { type Cabin, type NewCabin } from '~/services/apiCabins';

import Button from '~/ui/Button';
import FileInput from '~/ui/FileInput';
import Form from '~/ui/Form';
import FormRow from '~/ui/FormRow';
import Input from '~/ui/Input';
import Textarea from '~/ui/Textarea';

type FormValues = NewCabin & { image: FileList };

function CreateCabinForm({
  cabinToEdit = {} as Cabin,
  onCloseModal,
}: {
  cabinToEdit?: Cabin;
  onCloseModal?: () => void;
}) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm<FormValues>({
    defaultValues: isEditSession ? (editValues as FormValues) : {},
  });
  const { errors } = formState;

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isEditSession) {
      editCabin(
        {
          newCabinData: { ...data, image },
          id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? 'modal' : 'regular'}>
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
        <Button color="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Edit cabin' : 'Create new cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
