import type { SchemaEventFormInfer } from "@/definitions/event";
import { getRouteApi } from "../lib/route";

export const getCollectionEvents = async (token: string, page: number) => {
  return await fetch(getRouteApi("~event.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemEvent= async (token: string, userId: number) => {
  return await fetch(getRouteApi("~event.show", { id: userId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editEvent= async (
  token: string,
  userId: number,
  values: SchemaEventFormInfer
) => {
  return await fetch(getRouteApi("~event.update", { id: userId }), {
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

export const createEvent= async (
  token: string,
  values: SchemaEventFormInfer
) => {
  return await fetch(getRouteApi("~event.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteEvent= async (token: string, userId: number) => {
  return await fetch(getRouteApi("~event.delete", { id: userId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
