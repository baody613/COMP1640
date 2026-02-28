import apiClient from "../api";

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
};
