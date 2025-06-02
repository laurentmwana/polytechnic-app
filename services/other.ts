import type { SchemaContactFormInfer } from "../definitions/other";
import { getRouteApi } from "../lib/route";

// DEPARTMENT

export const getCollectionDepartments = async (page: number) => {
  return await fetch(getRouteApi("*department.index", { page }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getDepartmentLimit = async (limit: number) => {
  return await fetch(getRouteApi("*department.index", { limit }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getShowDepartment = async (id: number) => {
  return await fetch(getRouteApi("*department.show", { id }), {
    headers: {
      Accept: "application/json",
    },
  });
};

// OPTION

export const getCollectionOptions = async (page: number) => {
  return await fetch(getRouteApi("*option.index", { page }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getOptionLimit = async (limit: number) => {
  return await fetch(getRouteApi("*option.index", { limit }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getShowOption = async (id: number) => {
  return await fetch(getRouteApi("*option.show", { id }), {
    headers: {
      Accept: "application/json",
    },
  });
};

// LEVEL

export const getCollectionLevels = async (page: number) => {
  return await fetch(getRouteApi("*level.index", { page }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getLevelLimit = async (limit: number) => {
  return await fetch(getRouteApi("*level.index", { limit }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getShowLevel = async (id: number) => {
  return await fetch(getRouteApi("*level.show", { id }), {
    headers: {
      Accept: "application/json",
    },
  });
};

// YEAR ACADEMIC

export const getCollectionYears = async (page: number) => {
  return await fetch(getRouteApi("*year.index", { page }), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getCurrentYear = async () => {
  return await fetch(getRouteApi("*year.current"), {
    headers: {
      Accept: "application/json",
    },
  });
};

export const getShowYear = async (id: number) => {
  return await fetch(getRouteApi("*year.show", { id }), {
    headers: {
      Accept: "application/json",
    },
  });
};

// CONTACT US
export const contactUs = async (values: SchemaContactFormInfer) => {
  return await fetch(getRouteApi("&contact"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
