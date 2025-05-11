export const ROUTES = {
  welcome: '/',
  about: '/about',
  login: '/login',
  'reset-password': '/reset-password',
  'forgot-password': '/forgot-password',
  'verify-email': '/verify-email',
  dashboard: '/dashboard',
  profile: '/profile',

  'contact.index': '/contact-us',
  'department.index': '/department',
  'department.show': '/department/:id',
  'option.index': '/option',
  'option.show': '/option/:id',
  'deliberation.index': '/deliberation',

  '~department.index': '/admin/department',
  '~department.show': '/admin/department/:id',

  '~option.index': '/admin/option',
  '~option.show': '/admin/option/:id',
}

export const API_ROUTES = {
  login: '/login',
  logout: '/logout',
  'reset-password': '/reset-password',
  'forgot-password': '/forgot-password',
  'verify-email': '/email/verification-notification',
  'verify-opt': '/email/verify/:opt',
  me: '/me',

  'profile.edit': '/profile/edit',
  'profile.password': '/profile/change-password',

  'faculty.index': '/faculty',
  'faculty.show': '/faculty/:id',

  'department.index': '/department',
  'department.show': '/department/:id',

  'option.index': '/option',
  'option.show': '/option/:id',

  'professor.index': '/professor',
  'professor.show': '/professor/:id',
  'professor.leader': '/professor/leader',

  '~department.index': '/admin/department',
  '~department.show': '/admin/department/:id',
  '~department.create': '/admin/department',
  '~department.update': '/admin/department/:id',
  '~department.destroy': '/admin/department/:id',

  '~option.index': '/admin/option',
  '~option.show': '/admin/option/:id',
  '~option.create': '/admin/option',
  '~option.update': '/admin/option/:id',
  '~option.destroy': '/admin/option/:id',
}

export const API_LOCAL_ROUTES = {
  'department.index': '/api/other/department',
  'department.show': '/api/other/department/:id',

  'option.index': '/api/other/option',
  'option.show': '/api/other/option/:id',
}

type RouteParams = Record<string, string | number | boolean | null>

function resolveRoute<T extends Record<keyof T, string>>(
  routes: T,
  key: keyof T,
  params?: RouteParams
): string {
  const route = routes[key]

  if (!route) {
    throw new Error(`Route introuvable : ${String(key)}`)
  }

  let resolvedRoute = route.toString()
  const queryParams: Record<string, string> = {}

  // Remplacer les paramètres de type :param dans la route
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      const pattern = `:${paramKey}`

      if (resolvedRoute.includes(pattern)) {
        // Remplace toutes les occurrences de :paramKey par la valeur encodée
        resolvedRoute = resolvedRoute.replace(
          new RegExp(`:${paramKey}\\b`, 'g'),
          encodeURIComponent(String(paramValue))
        )
      } else {
        // Si paramètre non utilisé dans le chemin, on le met en query string
        queryParams[paramKey] = String(paramValue)
      }
    }
  }

  // Vérifier s'il reste des paramètres non remplacés (ex: :id)
  const missingParams = resolvedRoute.match(/:([a-zA-Z0-9_]+)/g)
  if (missingParams) {
    throw new Error(
      `Paramètres manquants dans la route ${String(key)} : ${missingParams.join(
        ', '
      )}`
    )
  }

  // Construire la query string si besoin
  const queryString =
    Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams).toString()}`
      : ''

  return `${resolvedRoute}${queryString}`
}

export const webRoute = (
  key: keyof typeof ROUTES,
  params?: RouteParams
): string => {
  return resolveRoute(ROUTES, key, params)
}

export const apiRoute = (
  key: keyof typeof API_ROUTES,
  params?: RouteParams
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENTRY_POINT_URL_EXTERNAL
  if (!baseUrl)
    throw new Error('NEXT_PUBLIC_API_ENTRY_POINT_URL_EXTERNAL is not defined')
  return baseUrl + resolveRoute(API_ROUTES, key, params)
}

export const apiLocalRoute = (
  key: keyof typeof API_LOCAL_ROUTES,
  params?: RouteParams
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ENTRY_POINT_URL_LOCAL
  if (!baseUrl)
    throw new Error('NEXT_PUBLIC_API_ENTRY_POINT_URL_LOCAL is not defined')
  return baseUrl + resolveRoute(API_LOCAL_ROUTES, key, params)
}
