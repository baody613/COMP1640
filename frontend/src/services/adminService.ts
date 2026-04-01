import apiClient from "../api";

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

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ideas_export_${topicId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Export documents to ZIP
  async exportDocumentsZIP(topicId: number): Promise<void> {
    const response = await apiClient.get(`/Admin/export-documents/${topicId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `documents_export_${topicId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Export all data (CSV + Documents)
  async exportAllData(topicId: number): Promise<void> {
    const response = await apiClient.get(`/Admin/export-all-data/${topicId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `all_data_export_${topicId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
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
};
