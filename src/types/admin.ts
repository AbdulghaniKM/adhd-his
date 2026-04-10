export interface AdminResponse {
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
}

export interface CreateAdminRequest {
  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;
  Password: string;
  image?: File;
}

export interface UpdateAdminRequest {
  FirstName?: string;
  LastName?: string;
  Username?: string;
  Email?: string;
  Password?: string;
  image?: File;
}
