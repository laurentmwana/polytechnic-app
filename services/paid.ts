import { getRouteApi } from "../lib/route";

export const getAllPaidAcademics = async (token: string, page: number) => {
  return await fetch(getRouteApi("°paid-aca.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemPaidAcademic = async (token: string, id: number) => {
  return await fetch(getRouteApi("°paid-aca.show", { id: id }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllPaidLabos = async (token: string, page: number) => {
  return await fetch(getRouteApi("°paid-labo.index", { page }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemPaidLabo = async (token: string, id: number) => {
  return await fetch(getRouteApi("°paid-labo.show", { id: id }), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
