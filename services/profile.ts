import type {
  SchemaProfileInfoInfer,
  SchemaProfilePasswordInfer,
} from "../definitions/profile";
import { getRouteApi } from "../lib/route";

export const editProfileUser = async (
  token: string,
  values: SchemaProfileInfoInfer
) => {
  return await fetch(getRouteApi("profile.edit"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changePasswordUser = async (
  token: string,
  values: SchemaProfilePasswordInfer
) => {
  return await fetch(getRouteApi("profile.password"), {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
