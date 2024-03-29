import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '~/services/apiAuth';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueriesData(['user'], data.user);
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.error('ERROR!!', err);
      toast.error('The provided email or password is incorrect. Please try again.');
    },
  });

  return {
    login,
    isLoading,
  };
}
