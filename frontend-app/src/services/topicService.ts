import apiClient from "../api";
import type { Topic } from "../types";

export const topicService = {
  async getAllTopics(): Promise<Topic[]> {
    const response = await apiClient.get<Topic[]>("/Topic/all");
    return response.data;
  },

  async getTopicById(id: number): Promise<Topic> {
    const response = await apiClient.get<Topic>(`/Topic/${id}`);
    return response.data;
  },
};
