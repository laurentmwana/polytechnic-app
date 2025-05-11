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

  'level.index': '/level',
  'level.show': '/level/:id',

  'programme.index': '/programme',
  'programme.show': '/programme/:id',

  'year.index': '/year-academic',
  'year.show': '/year-academic/:id',

  'deliberation.index': '/deliberation',

  '~department.index': '/dashboard/department',
  '~department.show': '/dashboard/department/:id',

  '~option.index': '/dashboard/option',
  '~option.show': '/dashboard/option/:id',
}

export const API_ROUTES = {
  login: '/login',
  logout: '/logout',
  'reset-password': '/reset-password',
  'forgot-password': '/forgot-password',
  'verify-email': '/email/verification-notification',
  'verify-opt': '/email/verify/:opt',
  refresh: '/refresh',
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

  'level.index': '/level',
  'level.show': '/level/:id',

  'programme.index': '/programme',
  'programme.show': '/programme/:id',

  'year.index': '/year-academic',
  'year.pending': '/pending/year-academic',
  'year.show': '/year-academic/:id',

  '~department.index': '/dashboard/department',
  '~department.show': '/dashboard/department/:id',
  '~department.create': '/dashboard/department',
  '~department.update': '/dashboard/department/:id',
  '~department.destroy': '/dashboard/department/:id',

  '~option.index': '/dashboard/option',
  '~option.show': '/dashboard/option/:id',
  '~option.create': '/dashboard/option',
  '~option.update': '/dashboard/option/:id',
  '~option.destroy': '/dashboard/option/:id',

  '~level.index': '/dashboard/level',
  '~level.show': '/dashboard/level/:id',
  '~level.create': '/dashboard/level',
  '~level.update': '/dashboard/level/:id',
  '~level.destroy': '/dashboard/level/:id',

  '~programme.index': '/dashboard/programme',
  '~programme.show': '/dashboard/programme/:id',
  '~programme.create': '/dashboard/programme',
  '~programme.update': '/dashboard/programme/:id',
  '~programme.destroy': '/dashboard/programme/:id',
}

export const API_LOCAL_ROUTES = {
  'department.index': '/api/other/department',
  'department.show': '/api/other/department/:id',

  'option.index': '/api/other/option',
  'option.show': '/api/other/option/:id',

  'level.index': '/api/other/level',
  'level.show': '/api/other/level/:id',

  'programme.index': '/api/other/programme',
  'programme.show': '/api/other/programme/:id',

  'year.index': '/api/other/year-academic',
  'year.pending': '/api/other/year-academic/pending',
  'year.show': '/api/other/year-academic/:id',

  'profile.edit': '/api/profile/edit',
  'profile.password': '/api/profile/change-password',

  '~level.index': '/api/dashboard/level',
  '~level.show': '/api/dashboard/level/:id',
  '~level.update': '/api/dashboard/level/:id/edit',
  '~level.create': '/api/dashboard/level/create',
  '~level.destroy': '/api/dashboard/level/:id/delete',

  '~programme.index': '/api/dashboard/programme',
  '~programme.show': '/api/dashboard/programme/:id',
  '~programme.update': '/api/dashboard/programme/:id/edit',
  '~programme.create': '/api/dashboard/programme/create',
  '~programme.destroy': '/api/dashboard/programme/:id/delete',

  '~option.index': '/api/dashboard/option',
  '~option.show': '/api/dashboard/option/:id',
  '~option.update': '/api/dashboard/option/:id/edit',
  '~option.create': '/api/dashboard/option/create',
  '~option.destroy': '/api/dashboard/option/:id/delete',

  '~department.index': '/api/dashboard/department',
  '~department.show': '/api/dashboard/department/:id',
  '~department.update': '/api/dashboard/department/:id/edit',
  '~department.create': '/api/dashboard/department/create',
  '~department.destroy': '/api/dashboard/department/:id/delete',
}
