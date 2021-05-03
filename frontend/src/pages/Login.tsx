import { useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import LoginRequest from '../models/auth/LoginRequest';
import authService from '../services/AuthService';

export default function Login() {
  const { setAuthenticatedUser } = useAuth();
  const history = useHistory();

  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (loginRequest: LoginRequest) => {
    try {
      const data = await authService.login(loginRequest);
      setAuthenticatedUser(data.user);
      history.push('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="card shadow">
        <h1 className="mb-3 text-center font-semibold text-4xl">Login</h1>
        <hr />
        <form
          className="flex flex-col gap-5 mt-8 w-64"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            className="input sm:text-lg"
            placeholder="Username"
            required
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input sm:text-lg"
            placeholder="Password"
            required
            disabled={isSubmitting}
            {...register('password')}
          />
          <button
            className="btn mt-3 sm:text-lg"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Login'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
