import type { SchemaDeliberationFormInfer } from "../definitions/deliberation";
import { getRouteApi } from "../lib/route";

export const getCollectionDeliberations = async (
  token: string,
  page: number
) => {
  return await fetch(getRouteApi("~deliberation.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemDeliberation = async (
  token: string,
  DeliberationId: number
) => {
  return await fetch(
    getRouteApi("~deliberation.show", { id: DeliberationId }),
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const editDeliberation = async (
  token: string,
  DeliberationId: number,
  values: SchemaDeliberationFormInfer
) => {
  return await fetch(
    getRouteApi("~deliberation.update", { id: DeliberationId }),
    {
      method: "PUT",
      body: JSON.stringify({
        ...values,
        id: DeliberationId,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createDeliberation = async (
  token: string,
  values: SchemaDeliberationFormInfer
) => {
  return await fetch(getRouteApi("~deliberation.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDeliberation = async (
  token: string,
  DeliberationId: number
) => {
  return await fetch(
    getRouteApi("~deliberation.delete", { id: DeliberationId }),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
