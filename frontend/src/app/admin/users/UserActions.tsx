'use client'

import { DeleteUserButton, UserFormModal } from './UserForms'

interface User {
  id: number
  fullName: string
  email: string
  phone: string
  userType: string
  role: string
  status: string
}

export function UserTableRowActions({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <UserFormModal mode="edit" initialData={user} iconOnly={true} />
      <DeleteUserButton userId={user.id} userName={user.fullName} iconOnly={true} />
    </div>
  )
}
