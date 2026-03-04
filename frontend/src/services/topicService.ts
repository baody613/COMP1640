import apiClient from "../api";
import type { Topic } from "../types";

export interface TopicFormData {
  name: string;
  description: string;
  ideaSubmissionDeadline: string; // ISO string
  commentDeadline: string; // ISO string
}

export const topicService = {
  async getAllTopics(): Promise<Topic[]> {
    const response = await apiClient.get<Topic[]>("/Topic/all");
    return response.data;
  },

  async getTopicById(id: number): Promise<Topic> {
    const response = await apiClient.get<Topic>(`/Topic/${id}`);
    return response.data;
  },

  async createTopic(data: TopicFormData): Promise<Topic> {
    const response = await apiClient.post<Topic>("/Topic", data);
    return response.data;
  },

  async updateTopic(id: number, data: TopicFormData): Promise<Topic> {
    const response = await apiClient.put<Topic>(`/Topic/${id}`, data);
    return response.data;
  },

  async deleteTopic(id: number): Promise<void> {
    await apiClient.delete(`/Topic/${id}`);
  },
};
