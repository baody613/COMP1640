import apiClient from "../api";

export interface SystemSettings {
  id: number;
  settingKey: string;
  settingValue: string | null;
  description: string | null;
  updatedAt: string;
  updatedBy: number | null;
}

export interface UpdateSettingDto {
  value: string;
  description?: string;
}

export interface CreateSettingDto {
  key: string;
  value: string;
  description?: string;
}

export const systemSettingsService = {
  // Get all settings
  async getAllSettings(): Promise<SystemSettings[]> {
    const response = await apiClient.get<SystemSettings[]>("/SystemSettings");
    return response.data;
  },

  // Get setting by key
  async getSettingByKey(key: string): Promise<SystemSettings> {
    const response = await apiClient.get<SystemSettings>(
      `/SystemSettings/${key}`,
    );
    return response.data;
  },

  // Update setting
  async updateSetting(key: string, dto: UpdateSettingDto): Promise<void> {
    await apiClient.put(`/SystemSettings/${key}`, dto);
  },

  // Create new setting
  async createSetting(dto: CreateSettingDto): Promise<SystemSettings> {
    const response = await apiClient.post<SystemSettings>(
      `/SystemSettings`,
      dto,
    );
    return response.data;
  },

  // Delete setting
  async deleteSetting(key: string): Promise<void> {
    await apiClient.delete(`/SystemSettings/${key}`);
  },

  // Helper: Get setting value
  async getSettingValue(
    key: string,
    defaultValue: string = "",
  ): Promise<string> {
    try {
      const setting = await this.getSettingByKey(key);
      return setting.settingValue || defaultValue;
    } catch {
      return defaultValue;
    }
  },
};
