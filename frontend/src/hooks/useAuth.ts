import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../util/api';
export interface IAuthData {
  username?: string;
  email: string;
  password: string;
  role?: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const registerMutate = async (data: IAuthData) => {
    const res = await api.post('/auth/login', data);
    const token = res.data;
    return token;
  };
  return useMutation({
    mutationFn: registerMutate,
    onSuccess: (token) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      window.sessionStorage.setItem('token', token);
      window.location.replace('/');
    },
  });
}

export function useResiter() {
  const queryClient = useQueryClient();
  const registerMutate = async (data: IAuthData) => {
    return await api.post('/auth/register', data);
  };
  return useMutation({
    mutationFn: registerMutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
