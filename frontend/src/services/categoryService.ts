import apiClient from "../api";
import type { Category } from "../types";

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/Category");
    return response.data;
  },

  async getCategoriesByTopic(topicId: number): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      `/Category?topicId=${topicId}`,
    );
    return response.data;
  },

  async createCategory(
    name: string,
    topicId: number,
    description?: string,
  ): Promise<Category> {
    const response = await apiClient.post<Category>("/Category", {
      name,
      topicId,
      description,
    });
    return response.data;
  },

  async deleteCategory(id: number) {
    await apiClient.delete(`/Category/${id}`);
  },
};
