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
  is_follow: boolean;
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
  courses: CourseModel[];
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

export interface FeesAcademicModel {
  id: number;
  amount: number;
  level: LevelModel;
  year: YearModel;
  created_at: string;
  updated_at: string;
}

export interface FeesLaboratoryModel {
  id: number;
  amount: number;
  level: LevelModel;
  year: YearModel;
  created_at: string;
  updated_at: string;
}

export interface PaidAcademicModel {
  id: number;
  academic: FeesAcademicModel;
  paid_at: string | null;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaidLaboratoryModel {
  id: number;
  laboratory: FeesAcademicModel;
  paid_at: string | null;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseFollowModel {
  id: number;
  year: YearModel;
  course: CourseModel;
  student: StudentModel;
  created_at: string;
  updated_at: string;
}

export interface FolderModel {
  id: number;
  name: string;
  firstname: string;
  gender: string;
  phone: string;

  course_followeds: CourseFollowModel[];
  historic_levels: {
    id: number;
    level: LevelModel;
    year: YearModel;
    created_at: string;
    updated_at: string;
  }[];
  actual_level: {
    id: number;
    level: LevelModel;
    year: YearModel;
    created_at: string;
    updated_at: string;
  };
}
