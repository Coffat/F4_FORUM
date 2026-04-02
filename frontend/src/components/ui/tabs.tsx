"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

const Tabs = ({ value, onValueChange, children, className }: { 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode;
  className?: string;
}) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={cn("w-full", className)}>{children}</div>
  </TabsContext.Provider>
)

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 p-1 text-slate-500",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;
  
  return (
    <button
      ref={ref}
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-white text-indigo-600 shadow-sm" : "hover:text-slate-900",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;
  
  if (!isActive) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-6 animate-in fade-in-50 duration-500",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
