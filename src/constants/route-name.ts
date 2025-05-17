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
  '~department.edit': '/dashboard/department/:id/edit',

  '~option.index': '/dashboard/option',
  '~option.show': '/dashboard/option/:id',
  '~option.edit': '/dashboard/option/:id/edit',

  'news.index': '/news',
  'news.show': '/news/:id',
}

export const API_ROUTES = {
  'contact.send': '/contact/send',
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

  'news.index': '/news',
  'news.show': '/news/:id',

  'programme.index': '/programme',
  'programme.show': '/programme/:id',

  'year.index': '/year-academic',
  'year.pending': '/pending/year-academic',
  'year.show': '/year-academic/:id',

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

  '~level.index': '/admin/level',
  '~level.show': '/admin/level/:id',
  '~level.create': '/admin/level',
  '~level.update': '/admin/level/:id',
  '~level.destroy': '/admin/level/:id',

  '~programme.index': '/admin/programme',
  '~programme.show': '/admin/programme/:id',
  '~programme.create': '/admin/programme',
  '~programme.update': '/admin/programme/:id',
  '~programme.destroy': '/admin/programme/:id',

  'notification.index': '/notification',
  'notification.show': '/notification/:id',

  'eva.index': '/evaluator',
}

export const API_LOCAL_ROUTES = {
  me: '/api/me',
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

  'news.index': '/api/other/news',
  'news.show': '/api/other/news/:id',

  '~level.index': '/api/admin/level',
  '~level.show': '/api/admin/level/:id',
  '~level.update': '/api/admin/level/:id/edit',
  '~level.create': '/api/admin/level/create',
  '~level.destroy': '/api/admin/level/:id/delete',

  '~programme.index': '/api/admin/programme',
  '~programme.show': '/api/admin/programme/:id',
  '~programme.update': '/api/admin/programme/:id/edit',
  '~programme.create': '/api/admin/programme/create',
  '~programme.destroy': '/api/admin/programme/:id/delete',

  '~option.index': '/api/admin/option',
  '~option.show': '/api/admin/option/:id',
  '~option.update': '/api/admin/option/:id/edit',
  '~option.create': '/api/admin/option/create',
  '~option.destroy': '/api/admin/option/:id/delete',

  '~department.index': '/api/admin/department',
  '~department.show': '/api/admin/department/:id',
  '~department.update': '/api/admin/department/:id/edit',
  '~department.create': '/api/admin/department/create',

  'notification.index': '/api/notification',
  'notification.show': '/api/notification/:id',
  'eva.index': '/api/other/evaluator',
}
