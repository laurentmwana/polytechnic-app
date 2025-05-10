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
  permissions: UtilModel[]
  roles: UtilModel[]
  isEmailVerified: boolean
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
  description: string
  levels: Levels[]
}

export interface Level {
  id: number
  programme: Programme
  option: Option
}

export interface Programme {
  id: number
  name: string
  alias: string
}

export interface Professor {
  id: number
  name: string
  firstname: string
  image: string
  grade: string
  birth: string
  gender: string
  department: Department
}

export interface DepartmentMetaData {
  data: Department[]
  meta: PaginationMeta
}
