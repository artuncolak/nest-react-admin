import Content from "../models/content/Content";
import CreateContentRequest from "../models/content/CreateContentRequest";
import UpdateContentRequest from "../models/content/UpdateContentRequest";
import apiService from "./ApiService";

class ContentService {
  async findAll(courseId: string): Promise<Content[]> {
    return (await apiService.get<Content[]>(`/api/courses/${courseId}/contents`))
      .data;
  }

  async save(
    courseId: string,
    createContentRequest: CreateContentRequest
  ): Promise<void> {
    await apiService.post(`/api/courses/${courseId}/contents`, createContentRequest);
  }

  async update(
    courseId: string,
    id: string,
    updateContentRequest: UpdateContentRequest
  ): Promise<void> {
    await apiService.put(
      `/api/courses/${courseId}/contents/${id}`,
      updateContentRequest
    );
  }

  async delete(courseId: string, id: string): Promise<void> {
    await apiService.delete(`/api/courses/${courseId}/contents/${id}`);
  }
}

export default new ContentService();
