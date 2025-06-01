const ROUTES_API = {
  login: "/login",
  forgot: "/forgot-password",
  "reset-password": "/reset-password",

  // PROFILE

  "profile.edit": "/profile/edit",
  "profile.password": "/profile/change-password",

  // OTHER

  "&student": "/data-select/students",

  // ADMIN

  "~user.index": "/admin/user",
  "~user.store": "/admin/user",
  "~user.show": "/admin/user/:id",
  "~user.update": "/admin/user/:id",
  "~user.delete": "/admin/user/:id",
  "~user.lock": "/admin/user/:id/lock",
};

type RouteParams = Record<string, string | number | boolean | null>;

function resolveRoute<T extends Record<keyof T, string>>(
  routes: T,
  key: keyof T,
  params?: RouteParams
): string {
  const route = routes[key];

  if (!route) {
    throw new Error(`Route introuvable : ${String(key)}`);
  }

  let resolvedRoute = route.toString();
  const queryParams: Record<string, string> = {};

  // Remplacer les paramètres de type :param dans la route
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      const pattern = `:${paramKey}`;

      if (resolvedRoute.includes(pattern)) {
        // Remplace toutes les occurrences de :paramKey par la valeur encodée
        resolvedRoute = resolvedRoute.replace(
          new RegExp(`:${paramKey}\\b`, "g"),
          encodeURIComponent(String(paramValue))
        );
      } else {
        // Si paramètre non utilisé dans le chemin, on le met en query string
        queryParams[paramKey] = String(paramValue);
      }
    }
  }

  // Vérifier s'il reste des paramètres non remplacés (ex: :id)
  const missingParams = resolvedRoute.match(/:([a-zA-Z0-9_]+)/g);
  if (missingParams) {
    throw new Error(
      `Paramètres manquants dans la route ${String(key)} : ${missingParams.join(
        ", "
      )}`
    );
  }

  // Construire la query string si besoin
  const queryString =
    Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";

  return `${resolvedRoute}${queryString}`;
}

export const getRouteApi = (
  key: keyof typeof ROUTES_API,
  params?: RouteParams
): string => {
  const baseUrl = import.meta.env.VITE_LARAVEL_API_ENTRY_POINT;

  if (!baseUrl) throw new Error("LARAVEL_API_ENTRY_POINT is not defined");
  return baseUrl + resolveRoute(ROUTES_API, key, params);
};
