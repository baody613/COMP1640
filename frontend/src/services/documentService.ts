import apiClient from "../api";

export interface Document {
  id: number;
  ideaId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export const documentService = {
  // Upload document for an idea
  async uploadDocument(ideaId: number, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `/Document/upload/${ideaId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  // Get document by ID
  async getDocument(id: number): Promise<Document> {
    const response = await apiClient.get<Document>(`/Document/${id}`);
    return response.data;
  },

  // Get all documents for an idea
  async getDocumentsByIdea(ideaId: number): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(
      `/Document/idea/${ideaId}`,
    );
    return response.data;
  },

  // Delete document
  async deleteDocument(id: number): Promise<void> {
    await apiClient.delete(`/Document/${id}`);
  },

  // Get download URL for a document
  getDownloadUrl(filePath: string): string {
    return `http://localhost:5000${filePath}`;
  },
};
