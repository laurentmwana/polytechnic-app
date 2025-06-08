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

export interface ActualLevelModel {
  id: number;
  level: LevelModel;
  year: YearModel;
  created_at: string;
  updated_at: string;
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
  actual_level: ActualLevelModel;
  user: UserModel | null;
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

export interface YearModel {
  id: number;
  name: string;
  start: number;
  end: number;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentModel {
  id: number;
  name: string;
  alias: string;
  options: OptionModel[];
  created_at: string;
  updated_at: string;
}

export interface OptionModel {
  id: number;
  name: string;
  alias: string;
  department: DepartmentModel;
  levels: LevelModel[];
  created_at: string;
  updated_at: string;
}

export interface LevelModel {
  id: number;
  name: string;
  alias: string;
  option: OptionModel;
  programme: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModel {
  id: number;
  name: string;
  code: string;
  credits: number;
  level: LevelModel;
  teacher: TeacherModel;
  created_at: string;
  updated_at: string;
}

export interface TeacherModel {
  id: number;
  name: string;
  firstname: string;
  phone: string;
  gender: string;
  department: DepartmentModel;
  created_at: string;
  updated_at: string;
}

export interface DeliberationModel {
  id: number;
  criteria: string;
  start_at: string;
  year: YearModel;
  level: LevelModel;
  juries: JuryModel[];
  semester: string;
  created_at: string;
  updated_at: string;
}

export interface JuryModel {
  id: number;
  teacher: TeacherModel;
  deliberation: DeliberationModel;
  created_at: string;
  updated_at: string;
}
