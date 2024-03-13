import { useState } from 'react';

import Button from '~/ui/Button';
import FileInput from '~/ui/FileInput';
import Form from '~/ui/Form';
import FormRow from '~/ui/FormRow';
import Input from '~/ui/Input';

import { useUpdateUser } from '~/features/authentication/useUpdateUser';
import { useUser } from '~/features/authentication/useUser';

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const { user } = useUser();
  const email = user?.email || '';
  const currentFullName: string = user?.user_metadata?.fullName || '';

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  const { updateUser, isUpdating } = useUpdateUser();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName.trim()) return;
    updateUser(
      { fullName: fullName.trim(), avatar },
      {
        onSuccess: () => {
          (e.target as HTMLFormElement).reset();
          setAvatar(null);
        },
      }
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
