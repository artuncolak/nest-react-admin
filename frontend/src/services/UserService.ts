import CreateUserRequest from "../models/CreateUserRequest";
import UpdateUserRequest from "../models/UpdateUserRequest";
import User from "../models/User";
import axios from "./AxiosService";

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await axios.post("/api/users", createUserRequest);
  }

  async findAll(): Promise<User[]> {
    return (await axios.get<User[]>("/api/users")).data;
  }

  async update(
    id: string,
    updateUserRequest: UpdateUserRequest
  ): Promise<void> {
    const {
      firstName,
      isActive,
      lastName,
      password,
      role,
      username,
    } = updateUserRequest;
    await axios.put(`/api/users/${id}`, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      username: username || undefined,
      role: role || undefined,
      isActive,
      password: password || undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/api/users/${id}`);
  }
}

export default new UserService();
