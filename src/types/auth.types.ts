import { AppRole } from './enums.types';

export interface AuthUser {
  id: string;
  name: string;
}

export interface LoginResponseData {
  accessToken: string;
  expiresAt: string;
  role: AppRole;
  user: AuthUser;
}
