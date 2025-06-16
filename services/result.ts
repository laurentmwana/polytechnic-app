import { getRouteApi } from "../lib/route";

export const getCollectionResults = async (token: string, page: number) => {
  return await fetch(getRouteApi("~result.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemResult = async (token: string, resultId: number) => {
  return await fetch(getRouteApi("~result.show", { id: resultId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createResult = async (
  token: string,
  formData: FormData
) => {
  return await fetch(getRouteApi("~result.store"), {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteResult = async (token: string, resultId: number) => {
  return await fetch(getRouteApi("~result.delete", { id: resultId }), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
