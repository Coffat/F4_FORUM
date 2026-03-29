/** Query cho GET /api/admin/users và đường dẫn /admin/users (đồng bộ search + filter + page). */

export function buildUsersApiQueryString(args: {
  page: string
  size: string
  search: string
  userType: string
  status: string
  role: string
}): string {
  const sp = new URLSearchParams()
  sp.set('page', args.page)
  sp.set('size', args.size)
  if (args.search) sp.set('search', args.search)
  if (args.userType) sp.set('userType', args.userType)
  if (args.status) sp.set('status', args.status)
  if (args.role) sp.set('role', args.role)
  return sp.toString()
}

export function buildAdminUsersPath(args: {
  page: number
  search?: string
  userType?: string
  status?: string
  role?: string
}): string {
  const sp = new URLSearchParams()
  if (args.page !== 0) sp.set('page', String(args.page))
  if (args.search) sp.set('search', args.search)
  if (args.userType) sp.set('userType', args.userType)
  if (args.status) sp.set('status', args.status)
  if (args.role) sp.set('role', args.role)
  const s = sp.toString()
  return s ? `/admin/users?${s}` : '/admin/users'
}
