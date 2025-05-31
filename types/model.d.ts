export interface AuthModel {
  id: number;
  name: string;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
  token: string;
}

export interface ForgotPasswordModel {
  message: string;
  is_send: boolean;
}
