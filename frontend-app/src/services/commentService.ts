import apiClient from "../api";
import type { Comment, CommentFormData } from "../types";

export const commentService = {
  async getCommentsByIdea(ideaId: number): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(`/Comment/idea/${ideaId}`);
    return response.data;
  },

  async createComment(ideaId: number, data: CommentFormData): Promise<Comment> {
    const response = await apiClient.post<Comment>("/Comment", {
      ideaId,
      ...data,
    });
    return response.data;
  },

  async updateComment(id: number, content: string): Promise<Comment> {
    const response = await apiClient.put<Comment>(`/Comment/${id}`, {
      content,
    });
    return response.data;
  },

  async deleteComment(id: number) {
    await apiClient.delete(`/Comment/${id}`);
  },

  async getLatestComments(limit: number = 10): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(
      `/Comment/latest?limit=${limit}`,
    );
    return response.data;
  },
};
