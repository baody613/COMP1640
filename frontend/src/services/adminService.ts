import apiClient from "../api";

function triggerBlobDownload(blobData: BlobPart, filename: string): void {
  const objectUrl = window.URL.createObjectURL(new Blob([blobData]));
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.setAttribute("download", filename);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
}

export interface AdminIdeaDocument {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
}

export interface AdminIdeaWithDocuments {
  id: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  authorName: string;
  authorEmail?: string;
  departmentName: string;
  categoryName: string;
  documents: AdminIdeaDocument[];
}

export interface AdminTopicIdeasResponse {
  topicId: number;
  topicName: string;
  totalIdeas: number;
  totalDocuments: number;
  ideas: AdminIdeaWithDocuments[];
}

export const adminService = {
  // Export ideas to CSV
  async exportIdeasToCSV(topicId: number): Promise<void> {
    const response = await apiClient.get(`/Admin/export-csv/${topicId}`, {
      responseType: "blob",
    });
    triggerBlobDownload(response.data, `ideas_export_${topicId}.csv`);
  },

  // Export documents to ZIP
  async exportDocumentsZIP(topicId: number): Promise<void> {
    const response = await apiClient.get(`/Admin/export-documents/${topicId}`, {
      responseType: "blob",
    });
    triggerBlobDownload(response.data, `documents_export_${topicId}.zip`);
  },

  // Export all data (CSV + Documents)
  async exportAllData(topicId: number): Promise<void> {
    const response = await apiClient.get(`/Admin/export-all-data/${topicId}`, {
      responseType: "blob",
    });
    triggerBlobDownload(response.data, `all_data_export_${topicId}.zip`);
  },

  // Get topic ideas with uploaded documents for admin review
  async getIdeasWithDocumentsByTopic(
    topicId: number,
  ): Promise<AdminTopicIdeasResponse> {
    const response = await apiClient.get(
      `/Admin/topics/${topicId}/ideas-with-documents`,
    );
    return response.data;
  },

  // Assign role to a user
  async assignRole(userId: number, role: string): Promise<void> {
    await apiClient.patch(`/Admin/users/${userId}/role`, { role });
  },

  // Create a new user
  async createUser(data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    departmentId?: number;
  }): Promise<any> {
    const response = await apiClient.post(`/Admin/users`, data);
    return response.data;
  },

  // Update user
  async updateUser(
    userId: number,
    data: {
      fullName: string;
      email: string;
      password?: string;
      role: string;
      departmentId?: number;
      isActive: boolean;
    },
  ): Promise<any> {
    const response = await apiClient.put(`/Admin/users/${userId}`, data);
    return response.data;
  },

  // Delete user (deactivate)
  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`/Admin/users/${userId}`);
  },
};
