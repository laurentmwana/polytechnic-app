import { getRouteApi } from "../lib/route";

export const getCollectionYears = async (token: string, page: number) => {
  return await fetch(getRouteApi("~year.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemYear = async (token: string, yearId: number) => {
  return await fetch(getRouteApi("~year.show", { id: yearId }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const closeYear = async (token: string, yearId: number) => {
  return await fetch(getRouteApi("~year.close", { id: yearId }), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
