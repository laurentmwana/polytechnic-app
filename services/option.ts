import type { SchemaOptionFormInfer } from "../definitions/option";
import { getRouteApi } from "../lib/route";

export const getCollectionOptions = async (token: string, page: number) => {
  return await fetch(getRouteApi("~option.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemOption = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~option.show", { id: userId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editOption = async (
  token: string,
  userId: number,
  values: SchemaOptionFormInfer
) => {
  return await fetch(getRouteApi("~option.update", { id: userId }), {
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

export const createOption = async (
  token: string,
  values: SchemaOptionFormInfer
) => {
  return await fetch(getRouteApi("~option.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteOption = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~option.delete", { id: userId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
