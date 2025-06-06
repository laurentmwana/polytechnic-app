import type { SchemaTeacherFormInfer } from "../definitions/teacher";
import { getRouteApi } from "../lib/route";

export const getCollectionTeachers = async (token: string, page: number) => {
  return await fetch(getRouteApi("~teacher.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemTeacher = async (token: string, TeacherId: number) => {
  return await fetch(getRouteApi("~teacher.show", { id: TeacherId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editTeacher = async (
  token: string,
  TeacherId: number,
  values: SchemaTeacherFormInfer
) => {
  return await fetch(getRouteApi("~teacher.update", { id: TeacherId }), {
    method: "PUT",
    body: JSON.stringify({
      ...values,
      id: TeacherId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTeacher = async (
  token: string,
  values: SchemaTeacherFormInfer
) => {
  return await fetch(getRouteApi("~teacher.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTeacher = async (token: string, TeacherId: number) => {
  return await fetch(getRouteApi("~teacher.delete", { id: TeacherId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
