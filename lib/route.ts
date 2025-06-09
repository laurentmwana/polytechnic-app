const ROUTES_API = {
  login: "/login",
  forgot: "/forgot-password",
  "reset-password": "/reset-password",

  // OTHER

  "*year.current": "/current/year",
  "*year.index": "/years",
  "*year.show": "/year/:id",

  "*department.index": "/departments",
  "*department.show": "/department/:id",

  "*option.index": "/options",
  "*option.show": "/option/:id",

  "*level.index": "/levels",
  "*level.show": "/level/:id",

  "*delibe.index": "/deliberations",
  "*delibe.show": "/deliberation/:id",

  "*teacher.index": "/teachers",
  "*teacher.show": "/teacher/:id",

  "*course.index": "/courses",
  "*course.show": "/course/:id",

  "*fees-aca.index": "/fees-academics",
  "*fees-aca.show": "/fees-academic/:id",

  "*fees-labo.index": "/fees-laboratories",
  "*fees-labo.show": "/fees-laboratory/:id",

  // PROFILE

  "profile.edit": "/profile/edit",
  "profile.password": "/profile/change-password",

  // STUDENT
  "°paid-labo.index": "/student/paid-laboratory",
  "°paid-labo.show": "/student/paid-laboratory/:id",

  "°paid-aca.index": "/student/paid-academic",
  "°paid-aca.show": "/student/paid-academic/:id",

  "°c-follow.index": "/student/course-followed",
  "°c-follow.create": "/student/course-followed/:id",
  
  // OTHER

  "&student": "/data-select/students",
  "&level": "/data-select/levels",
  "&year": "/data-select/year-academic",
  "&teacher": "/data-select/teachers",
  "&course": "/data-select/courses",
  "&department": "/data-select/departments",
  "&option": "/data-select/options",
  "&delibe": "/data-select/deliberations",
  "&contact": "/contact",

  // ADMIN

  // USER

  "~user.index": "/admin/user",
  "~user.store": "/admin/user",
  "~user.show": "/admin/user/:id",
  "~user.update": "/admin/user/:id",
  "~user.delete": "/admin/user/:id",
  "~user.lock": "/admin/user/:id/lock",

  // STUDENT
  "~student.index": "/admin/student",
  "~student.store": "/admin/student",
  "~student.excel": "/admin/student/create-with-excel",
  "~student.show": "/admin/student/:id",
  "~student.update": "/admin/student/:id",
  "~student.delete": "/admin/student/:id",

  // COURSE
  "~course.index": "/admin/course",
  "~course.store": "/admin/course",
  "~course.show": "/admin/course/:id",
  "~course.update": "/admin/course/:id",
  "~course.delete": "/admin/course/:id",

  // TEACHER
  "~teacher.index": "/admin/teacher",
  "~teacher.store": "/admin/teacher",
  "~teacher.show": "/admin/teacher/:id",
  "~teacher.update": "/admin/teacher/:id",
  "~teacher.delete": "/admin/teacher/:id",

  // DEPARTMENT
  "~department.index": "/admin/department",
  "~department.show": "/admin/department/:id",
  "~department.update": "/admin/department/:id",

  // OPTION

  "~option.index": "/admin/option",
  "~option.store": "/admin/option",
  "~option.show": "/admin/option/:id",
  "~option.update": "/admin/option/:id",
  "~option.delete": "/admin/option/:id",

  // LEVEL
  "~level.index": "/admin/level",
  "~level.store": "/admin/level",
  "~level.show": "/admin/level/:id",
  "~level.update": "/admin/level/:id",
  "~level.delete": "/admin/level/:id",

  // DELIBE
  "~deliberation.index": "/admin/deliberation",
  "~deliberation.store": "/admin/deliberation",
  "~deliberation.show": "/admin/deliberation/:id",
  "~deliberation.update": "/admin/deliberation/:id",
  "~deliberation.delete": "/admin/deliberation/:id",

  // JURY
  "~jury.index": "/admin/jury",
  "~jury.store": "/admin/jury",
  "~jury.show": "/admin/jury/:id",
  "~jury.update": "/admin/jury/:id",
  "~jury.delete": "/admin/jury/:id",

  // YEAR
  "~year.index": "/admin/year-academic",
  "~year.close": "/admin/year-academic/:id/closed",
  "~year.show": "/admin/year-academic/:id",

  "~dashboard": "/dashboard",
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
