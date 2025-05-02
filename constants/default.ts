export const ROUTES = {
  welcome: '/',
  about: '/about',
  register: '/register',
  login: '/login',
  'reset-password': '/reset-password',
  'forgot-password': '/forgot-password',
  dashboard: '/dashboard',
  profile: '/profile',

  'contact.index': '/contact-us',
  'department.index': '/department',
  'option.index': '/option',
  'deliberation.index': '/deliberation',
}

export const API_ROUTES = {
  register: '/register',
  login: '/login',
  logout: '/logout',
  'reset-password': '/reset-password',
  'forgot-password': '/forgot-password',
  me: '/me',

  'faculty.index': '/faculty',
  'faculty.show': '/faculty/{id}',

  'department.index': '/department',
  'department.show': '/department/{id}',

  'option.index': '/option',
  'option.show': '/option/{id}',

  'professor.index': '/professor',
  'professor.show': '/professor/{id}',
  'professor.leader': '/professor/leader',
}
