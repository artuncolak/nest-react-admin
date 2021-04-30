import Course from "../models/Course";
import CreateCourseRequest from "../models/CreateCourseRequest";
import UpdateCourseRequest from "../models/UpdateCourseRequest";
import axios from "./AxiosService";

class UserService {
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await axios.post("/api/courses", createCourseRequest);
  }

  async findAll(): Promise<Course[]> {
    return (await axios.get<Course[]>("/api/courses")).data;
  }

  async update(
    id: string,
    updateCourseRequest: UpdateCourseRequest
  ): Promise<void> {
    await axios.put(`/api/courses/${id}`, updateCourseRequest);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/api/courses/${id}`);
  }
}

export default new UserService();
