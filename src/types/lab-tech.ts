export interface LabTechResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  imageUrl: string | null;
  lab?: {
    id: string;
    name: string;
  };
}

export interface CreateLabTechRequest {
  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;
  Password: string;
  Phone?: string;
  LabId: string;
  image?: File;
}

export interface UpdateLabTechRequest extends Partial<Omit<CreateLabTechRequest, 'Password'>> {
  Password?: string;
}
