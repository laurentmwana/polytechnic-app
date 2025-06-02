import type { SchemaUserFormInfer } from "../definitions/user";
import { getRouteApi } from "../lib/route";

export const getCollectionUsers = async (token: string, page: number) => {
  return await fetch(getRouteApi("~user.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemUsers = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~user.show", { id: userId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleDisableAccountUser = async (
  token: string,
  userId: number
) => {
  return await fetch(getRouteApi("~user.lock", { id: userId }), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editUser = async (
  token: string,
  userId: number,
  values: SchemaUserFormInfer
) => {
  return await fetch(getRouteApi("~user.update", { id: userId }), {
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

export const createUser = async (
  token: string,
  values: SchemaUserFormInfer
) => {
  return await fetch(getRouteApi("~user.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUser = async (token: string, userId: number) => {
  return await fetch(getRouteApi("~user.delete", { id: userId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
