export interface DepartmentResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  title: string;
}

export interface CreateDepartmentRequest {
  Title: string;
}

export interface UpdateDepartmentRequest {
  Title?: string;
}
