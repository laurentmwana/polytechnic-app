import { getRouteApi } from "../lib/route";

export const loginUser = async (body: { email: string; password: string }) => {
  return await fetch(getRouteApi("login"), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
