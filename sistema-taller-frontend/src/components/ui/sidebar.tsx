"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronRight } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"


// Contexto para manejar el estado del sidebar
const SidebarContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({ 
  open: true, 
  setOpen: () => {}, 
  mobileOpen: false, 
  setMobileOpen: () => {} 
})

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

const SidebarProvider = ({
  children,
  defaultOpen = true,
}: SidebarProviderProps) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar debe ser usado dentro de un SidebarProvider")
  }
  return context
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Sidebar = ({ children, className, ...props }: SidebarProps) => {
  const { open, mobileOpen } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

const SidebarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    />
  )
}

const SidebarContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    />
  )
}

const SidebarFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("mt-auto border-t", className)}
      {...props}
    />
  )
}

const SidebarMenu = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => {
  return (
    <ul
      className={cn("space-y-1 px-2", className)}
      {...props}
    />
  )
}

const SidebarMenuItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li
      className={cn(className)}
      {...props}
    />
  )
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, isActive = false, ...props }, ref) => {
    const { open } = useSidebar()
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          !open && "justify-center px-0",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"


const SidebarMenuSub = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => {
  const { open } = useSidebar()
  
  return (
    <ul
      className={cn(
        "mt-1 space-y-1",
        open ? "ml-6" : "ml-0",
        className
      )}
      {...props}
    />
  )
}

const SidebarMenuSubItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li
      className={cn(className)}
      {...props}
    />
  )
}

interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ className, asChild = false, isActive = false, ...props }, ref) => {
    const { open } = useSidebar()
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          !open && "justify-center px-0",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"


const SidebarInset = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, mobileOpen } = useSidebar();
  
  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        open ? "md:ml-64" : "md:ml-16",
        mobileOpen ? "ml-0" : "ml-0",
        className
      )}
      {...props}
    />
  )
}

const SidebarTrigger = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { open, setOpen } = useSidebar()
  
  return (
    <button
      className={cn(
        "absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-all hover:text-foreground",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <ChevronRight
        className={cn(
          "h-3 w-3 transition-transform",
          open ? "rotate-180" : "rotate-0"
        )}
      />
    </button>
  )
}

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
}