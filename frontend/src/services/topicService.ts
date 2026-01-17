import apiClient from "../api";
import type { Topic, CreateTopicRequest, TopicStatistics } from "../types";

// Simple cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const topicService = {
  async getAllTopics(): Promise<Topic[]> {
    try {
      const cacheKey = "all-topics";
      const cached = getCachedData(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get("/topic");
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  },

  async getTopicById(id: number): Promise<Topic> {
    try {
      const response = await apiClient.get(`/topic/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      throw error;
    }
  },

  async createTopic(data: CreateTopicRequest): Promise<Topic> {
    try {
      const response = await apiClient.post("/topic", data);
      cache.clear();
      return response.data;
    } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
    }
  },

  async updateTopic(id: number, data: CreateTopicRequest): Promise<Topic> {
    try {
      const response = await apiClient.put(`/topic/${id}`, data);
      cache.clear();
      return response.data;
    } catch (error) {
      console.error(`Error updating topic ${id}:`, error);
      throw error;
    }
  },

  async deleteTopic(id: number): Promise<void> {
    try {
      await apiClient.delete(`/topic/${id}`);
      cache.clear();
    } catch (error) {
      console.error(`Error deleting topic ${id}:`, error);
      throw error;
    }
  },

  async getStatistics(): Promise<TopicStatistics[]> {
    try {
      const response = await apiClient.get("/topic/statistics");
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  },

  async exportData(topicId: number): Promise<Blob> {
    try {
      const response = await apiClient.get(`/topic/${topicId}/export`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting data for topic ${topicId}:`, error);
      throw error;
    }
  },
};
