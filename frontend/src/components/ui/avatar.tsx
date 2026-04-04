import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const Avatar = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {children}
  </div>
)

const AvatarImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <Image
    src={src}
    alt={alt}
    width={100}
    height={100}
    className={cn("aspect-square h-full w-full object-cover", className)}
  />
)

const AvatarFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500", className)}>
    {children}
  </div>
)

export { Avatar, AvatarImage, AvatarFallback }
