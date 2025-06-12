import { getRouteApi } from "../lib/route";

export const getItemFolder = async (token: string) => {
    return await fetch(getRouteApi("°folder.index"), {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
}