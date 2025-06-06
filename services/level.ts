import type { SchemaLevelFormInfer } from "../definitions/level";
import { getRouteApi } from "../lib/route";

export const getCollectionLevels = async (token: string, page: number) => {
  return await fetch(getRouteApi("~level.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemLevel = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~level.show", { id: userId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editLevel = async (
  token: string,
  userId: number,
  values: SchemaLevelFormInfer
) => {
  return await fetch(getRouteApi("~level.update", { id: userId }), {
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

export const createLevel = async (
  token: string,
  values: SchemaLevelFormInfer
) => {
  return await fetch(getRouteApi("~level.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteLevel = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~level.delete", { id: userId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
