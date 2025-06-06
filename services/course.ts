import type { SchemaCourseFormInfer } from "../definitions/course";
import { getRouteApi } from "../lib/route";

export const getCollectionCourses = async (token: string, page: number) => {
  return await fetch(getRouteApi("~course.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemCourse = async (token: string, courseId: number) => {
  return await fetch(getRouteApi("~course.show", { id: courseId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editCourse = async (
  token: string,
  courseId: number,
  values: SchemaCourseFormInfer
) => {
  return await fetch(getRouteApi("~course.update", { id: courseId }), {
    method: "PUT",
    body: JSON.stringify({
      ...values,
      id: courseId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCourse = async (
  token: string,
  values: SchemaCourseFormInfer
) => {
  return await fetch(getRouteApi("~course.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCourse = async (token: string, courseId: number) => {
  return await fetch(getRouteApi("~course.delete", { id: courseId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
