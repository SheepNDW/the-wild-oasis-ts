import { useForm } from 'react-hook-form';
import Button from '~/ui/Button';
import Form from '~/ui/Form';
import FormRow from '~/ui/FormRow';
import Input from '~/ui/Input';

import { useUpdateUser } from '~/features/authentication/useUpdateUser';

type FormValues = {
  password: string;
  passwordConfirm: string;
};

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>();
  const { errors } = formState;

  const { updateUser, isUpdating } = useUpdateUser();

  function onSubmit({ password }: FormValues) {
    updateUser({ password }, { onSuccess: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isUpdating}
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'New password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRow>

      <FormRow label="Confirm password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          id="passwordConfirm"
          disabled={isUpdating}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value, formValues) =>
              formValues.password === value || 'Passwords need to match',
          })}
        />
      </FormRow>
      <FormRow>
        <Button onClick={() => reset()} type="reset" color="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
