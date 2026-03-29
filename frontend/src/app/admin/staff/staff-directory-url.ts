export type StaffSegment = 'ALL' | 'ACADEMIC' | 'ADMINISTRATIVE'

export function buildStaffPath(args: {
  search?: string
  segment?: StaffSegment
}): string {
  const sp = new URLSearchParams()
  const q = args.search?.trim()
  if (q) sp.set('search', q)
  if (args.segment && args.segment !== 'ALL') sp.set('segment', args.segment)
  const s = sp.toString()
  return s ? `/admin/staff?${s}` : '/admin/staff'
}

export function buildPersonnelApiQuery(args: { search: string; segment: string }): string {
  const sp = new URLSearchParams()
  if (args.search.trim()) sp.set('search', args.search.trim())
  if (args.segment && args.segment !== 'ALL') sp.set('segment', args.segment)
  return sp.toString()
}
