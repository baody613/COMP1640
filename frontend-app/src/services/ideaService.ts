import apiClient from "../api";
import type { Idea, IdeaFormData } from "../types";

export const ideaService = {
  async getIdeasByTopic(
    topicId: number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const response = await apiClient.get(`/Idea/topic/${topicId}`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  async getIdeaById(id: number): Promise<Idea> {
    const response = await apiClient.get<Idea>(`/Idea/${id}`);
    return response.data;
  },

  async createIdea(data: IdeaFormData): Promise<Idea> {
    const response = await apiClient.post<Idea>("/Idea", data);
    return response.data;
  },

  async getPopularIdeas(limit: number = 5): Promise<Idea[]> {
    const response = await apiClient.get<Idea[]>(
      `/Idea/popular?limit=${limit}`,
    );
    return response.data;
  },

  async getMostViewedIdeas(limit: number = 5): Promise<Idea[]> {
    const response = await apiClient.get<Idea[]>(
      `/Idea/most-viewed?limit=${limit}`,
    );
    return response.data;
  },

  async getLatestIdeas(limit: number = 5): Promise<Idea[]> {
    const response = await apiClient.get<Idea[]>(`/Idea/latest?limit=${limit}`);
    return response.data;
  },

  async addReaction(ideaId: number, isThumbsUp: boolean) {
    const response = await apiClient.post(`/Idea/${ideaId}/reaction`, {
      isThumbsUp,
    });
    return response.data;
  },

  async removeReaction(ideaId: number) {
    const response = await apiClient.delete(`/Idea/${ideaId}/reaction`);
    return response.data;
  },
};
