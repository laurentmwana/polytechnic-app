import { API_ROUTES, ROUTES } from '@/constants/default'

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

  const queryParams: Record<string, string> = {}
  let resolvedRoute = route.toString()

  // Traitement des paramètres obligatoires
  for (const [paramKey, paramValue] of Object.entries(params || {})) {
    const pattern = `[${paramKey}]`

    if (resolvedRoute.includes(pattern)) {
      resolvedRoute = resolvedRoute.replace(
        new RegExp(`\\[${paramKey}\\]`, 'g'),
        encodeURIComponent(String(paramValue))
      )
    } else {
      queryParams[paramKey] = String(paramValue)
    }
  }

  // Vérification des paramètres manquants
  const missingParams = resolvedRoute.match(/\[([^\]]+)\]/g)
  if (missingParams) {
    throw new Error(
      `Paramètres manquants dans la route ${String(key)} : ${missingParams.join(
        ', '
      )}`
    )
  }

  // Construction de la query string
  const queryString =
    Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams)}`
      : ''

  return `${resolvedRoute}${queryString}`
}

export const webRoute = (
  key: keyof typeof ROUTES,
  params?: RouteParams
): string => resolveRoute(ROUTES, key, params)

export const apiRoute = (
  key: keyof typeof API_ROUTES,
  params?: RouteParams
): string => resolveRoute(API_ROUTES, key, params)
