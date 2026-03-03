import apiClient from "../api";

export interface Department {
  id: number;
  name: string;
  code: string;
  qaCoordinatorId?: number;
  createdAt: string;
}

export const departmentService = {
  async getAllDepartments(): Promise<Department[]> {
    const response = await apiClient.get<Department[]>("/Department");
    return response.data;
  },

  async getDepartmentById(id: number): Promise<Department> {
    const response = await apiClient.get<Department>(`/Department/${id}`);
    return response.data;
  },

  async createDepartment(name: string, code: string): Promise<Department> {
    const response = await apiClient.post<Department>("/Department", {
      name,
      code,
    });
    return response.data;
  },

  async updateDepartment(
    id: number,
    name: string,
    code: string,
  ): Promise<Department> {
    const response = await apiClient.put<Department>(`/Department/${id}`, {
      name,
      code,
    });
    return response.data;
  },

  async deleteDepartment(id: number): Promise<void> {
    await apiClient.delete(`/Department/${id}`);
  },
};
