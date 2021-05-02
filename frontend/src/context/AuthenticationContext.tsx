import { createContext, Dispatch, SetStateAction, useState } from 'react';

import User from '../models/user/User';

interface AuthContextValue {
  authenticatedUser: User;
  setAuthenticatedUser: Dispatch<SetStateAction<User>>;
}

export const AuthenticationContext = createContext<AuthContextValue>(null);

export function AuthenticationProvider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

  return (
    <AuthenticationContext.Provider
      value={{ authenticatedUser, setAuthenticatedUser }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
