import type { SchemaDepartmentFormInfer } from "../definitions/department";
import { getRouteApi } from "../lib/route";

export const getCollectionDepartments = async (token: string, page: number) => {
  return await fetch(getRouteApi("~department.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemDepartment = async (
  token: string,
  departmentId: number
) => {
  return await fetch(getRouteApi("~department.show", { id: departmentId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editDepartment = async (
  token: string,
  departmentId: number,
  values: SchemaDepartmentFormInfer
) => {
  return await fetch(getRouteApi("~department.update", { id: departmentId }), {
    method: "PUT",
    body: JSON.stringify({
      ...values,
      id: departmentId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
