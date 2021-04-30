import CreateUserRequest from "../models/CreateUserRequest";
import User from "../models/User";
import axios from "./AxiosService";

class UserService {
  async save(createUserRequest: CreateUserRequest): Promise<void> {
    await axios.post("/api/users", createUserRequest);
  }

  async findAll(): Promise<User[]> {
    return (await axios.get<User[]>("/api/users")).data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/api/users/${id}`);
  }
}

export default new UserService();
