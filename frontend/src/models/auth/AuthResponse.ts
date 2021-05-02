import User from '../user/User';

export default interface AuthResponse {
  token: string;
  user: User;
}
