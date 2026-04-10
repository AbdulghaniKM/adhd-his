export interface LabResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  name: string;
  location: string | null;
  contactPhone: string | null;
}

export interface CreateLabRequest {
  Name: string;
  Location?: string;
  ContactPhone?: string;
}

export interface UpdateLabRequest extends Partial<CreateLabRequest> {}
