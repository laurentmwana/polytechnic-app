import { Department, Faculty } from "./model"

export interface DepartmentCollection {
  id: number
  name: string
  description: string
  options: number
  faculty: Faculty
}

export interface OptionCollection {
  id: number
  name: string
  levels: number
  department: Department
}
