export default interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}
