import type { SchemaActualityFormInfer } from "../definitions/actuality";
import { getRouteApi } from "../lib/route";

export const getCollectionActualities = async (
  token: string,
  page: number
) => {
  return await fetch(getRouteApi("~actuality.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemActuality = async (
  token: string,
  ActualityId: number
) => {
  return await fetch(
    getRouteApi("~actuality.show", { id: ActualityId }),
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const editActuality = async (
  token: string,
  ActualityId: number,
  values: SchemaActualityFormInfer
) => {
  return await fetch(
    getRouteApi("~actuality.update", { id: ActualityId }),
    {
      method: "PUT",
      body: JSON.stringify({
        ...values,
        id: ActualityId,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createActuality = async (
  token: string,
  values: SchemaActualityFormInfer
) => {
  return await fetch(getRouteApi("~actuality.store"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteActuality = async (
  token: string,
  ActualityId: number
) => {
  return await fetch(
    getRouteApi("~actuality.delete", { id: ActualityId }),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
