import type {
  SchemaStudentExcelFormInfer,
  SchemaStudentFormInfer,
} from "../definitions/student";
import { getRouteApi } from "../lib/route";

export const getCollectionStudents = async (token: string, page: number) => {
  return await fetch(getRouteApi("~student.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemStudent = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~student.show", { id: userId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editStudent = async (
  token: string,
  userId: number,
  values: SchemaStudentFormInfer
) => {
  return await fetch(getRouteApi("~student.update", { id: userId }), {
    method: "PUT",
    body: JSON.stringify({
      ...values,
      id: userId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStudent = async (
  token: string,
  values: SchemaStudentFormInfer
) => {
  return await fetch(getRouteApi("~student.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteStudent = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~student.delete", { id: userId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStudentExcell = async (
  token: string,
  values: SchemaStudentExcelFormInfer
) => {
  return await fetch(getRouteApi("~student.excel"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

