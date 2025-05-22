import { PaginationMeta } from './paginate'

export interface UserLogin {
  expires_in: number
  access_token: string
  token_type: string
}

export interface UtilModel {
  id: number
  name: string
}

export interface UserMe {
  id: string
  name: string
  email: string
  accessToken: string
  isEmailVerified: boolean
  role: string
}

export interface Faculty {
  id: number
  name: string
  description: string
}

export interface Department {
  id: number
  name: string
  description: string
  faculty: Faculty
  options: Option[]
  created_at: string
  updated_at: string
}

export interface Option {
  id: number
  name: string
  alias: string
  description: string
  levels: Levels[]
  created_at: string
  updated_at: string
}

export interface Level {
  id: number
  programme: Programme
  option: Option
  created_at: string
  updated_at: string
}

export interface Programme {
  id: number
  name: string
  alias: string
  programme_group: string
  created_at: string
  updated_at: string
}

export interface Programme {
  id: number
  name: string
  alias: string
  programme_group: string
  created_at: string
  updated_at: string
}

export interface Year {
  id: number
  name: string
  start: string
  end: string
  is_closed: boolean
  created_at: string
  updated_at: string
}

export interface Professor {
  id: number
  name: string
  firstname: string
  birth: string
  gender: string
  department: Department
  created_at: string
  updated_at: string
  courses: Course[]
}

export interface Deliberation {
  id: number
  title: string
  description: string
  created_at: string
  updated_at: string
}

export interface News {
  id: number
  start_at: string
  description: string
  level: Level
  year: Year
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  title: string
  description: string
  created_at: string
  updated_at: string
}

export interface DepartmentMetaData {
  data: Department[]
  meta: PaginationMeta
}

export interface OptionMetaData {
  data: Option[]
  meta: PaginationMeta
}

export interface LevelMetaData {
  data: Level[]
  meta: PaginationMeta
}

export interface ProgrammeMetaData {
  data: Programme[]
  meta: PaginationMeta
}

export interface YearMetaData {
  data: Year[]
  meta: PaginationMeta
}

export interface NotificationMetaData {
  data: Notification[]
  meta: PaginationMeta
}

export interface NewsMetaData {
  data: News[]
  meta: PaginationMeta
}

export interface ProfessorMetaData {
  data: Professor[]
  meta: PaginationMeta
}

export interface DeliberationMetaData {
  data: Deliberation[]
  meta: PaginationMeta
}
