export interface AuthModel {
  id: number;
  name: string;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
  accessToken: string;
}

export interface ForgotPasswordModel {
  message: string;
  is_send: boolean;
}

export interface ResetPasswordModel {
  message: string;
  is_update: boolean;
}

export interface StudentModel {
  id: number;
  name: string;
  firstname: string;
  gender: string;
  phone: string;
  user: UserModel | null;
  registration_token: string;
  brth: string;
  created_at: string;
  updated_at: string;
}

export interface UserModel {
  id: number;
  name: string;
  firstname: string;
  email: string;
  gender: string;
  roles: string[];
  isEmailVerified: boolean;
  student: StudentModel | null;
  created_at: string;
  updated_at: string;
}
