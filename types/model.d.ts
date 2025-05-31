export interface AuthModel {
  id: number;
  name: string;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
  token: string;
}
