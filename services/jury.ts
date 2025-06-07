import type { SchemaJuryFormInfer } from "../definitions/jury";
import { getRouteApi } from "../lib/route";

export const getCollectionJuries = async (token: string, page: number) => {
  return await fetch(getRouteApi("~jury.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemJury = async (token: string, JuryId: number) => {
  return await fetch(getRouteApi("~jury.show", { id: JuryId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editJury = async (
  token: string,
  JuryId: number,
  values: SchemaJuryFormInfer
) => {
  return await fetch(getRouteApi("~jury.update", { id: JuryId }), {
    method: "PUT",
    body: JSON.stringify({
      ...values,
      id: JuryId,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createJury = async (
  token: string,
  values: SchemaJuryFormInfer
) => {
  return await fetch(getRouteApi("~jury.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteJury = async (token: string, JuryId: number) => {
  return await fetch(getRouteApi("~jury.delete", { id: JuryId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
