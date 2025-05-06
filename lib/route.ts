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
  'option.index': '/option',
  'deliberation.index': '/deliberation',
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
}

type RouteParams = Record<string, string | number | boolean>

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
  const baseUrl = process.env.NEXT_PUBLIC_API_ENTRY_POINT_URL
  if (!baseUrl) throw new Error('API_ENTRY_POINT_URL is not defined')
  return baseUrl + resolveRoute(API_ROUTES, key, params)
}
