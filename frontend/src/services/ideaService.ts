import apiClient from "../api";
import type { Idea, CreateIdeaRequest, ReactToIdeaRequest } from "../types";

// Simple cache for ideas
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

const clearCache = () => {
  cache.clear();
};

export const ideaService = {
  async getAllIdeas(): Promise<Idea[]> {
    try {
      const cacheKey = "all-ideas";
      const cached = getCachedData(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get("/idea");
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching ideas:", error);
      throw error;
    }
  },

  async getIdeaById(id: number): Promise<Idea> {
    try {
      const response = await apiClient.get(`/idea/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching idea ${id}:`, error);
      throw error;
    }
  },

  async getIdeasByTopic(topicId: number): Promise<Idea[]> {
    try {
      const cacheKey = `topic-${topicId}-ideas`;
      const cached = getCachedData(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get(`/idea/topic/${topicId}`);
      setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ideas for topic ${topicId}:`, error);
      throw error;
    }
  },

  async createIdea(data: CreateIdeaRequest): Promise<Idea> {
    try {
      const response = await apiClient.post("/idea", data);
      clearCache(); // Clear cache after creating
      return response.data;
    } catch (error) {
      console.error("Error creating idea:", error);
      throw error;
    }
  },

  async updateIdea(id: number, data: CreateIdeaRequest): Promise<Idea> {
    try {
      const response = await apiClient.put(`/idea/${id}`, data);
      clearCache(); // Clear cache after updating
      return response.data;
    } catch (error) {
      console.error(`Error updating idea ${id}:`, error);
      throw error;
    }
  },

  async deleteIdea(id: number): Promise<void> {
    try {
      await apiClient.delete(`/idea/${id}`);
      clearCache(); // Clear cache after deleting
    } catch (error) {
      console.error(`Error deleting idea ${id}:`, error);
      throw error;
    }
  },

  async reactToIdea(ideaId: number, data: ReactToIdeaRequest): Promise<void> {
    try {
      await apiClient.post(`/idea/${ideaId}/react`, data);
      clearCache(); // Clear cache after reacting
    } catch (error) {
      console.error(`Error reacting to idea ${ideaId}:`, error);
      throw error;
    }
  },

  async getIdeasWithoutComments(topicId: number): Promise<Idea[]> {
    try {
      const response = await apiClient.get(
        `/idea/topic/${topicId}/no-comments`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ideas without comments for topic ${topicId}:`,
        error,
      );
      throw error;
    }
  },

  async getAnonymousIdeas(): Promise<Idea[]> {
    try {
      const response = await apiClient.get(`/idea/anonymous`);
      return response.data;
    } catch (error) {
      console.error("Error fetching anonymous ideas:", error);
      throw error;
    }
  },
};
