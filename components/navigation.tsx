"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { LanguageSwitch } from "@/components/language-switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslation } from "@/lib/translations"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const { t } = useTranslation()

  const routes = [
    {
      href: "/",
      label: "me",
      active: pathname === "/",
    },
    {
      href: "/projects",
      label: "projects",
      active: pathname === "/projects/",
    },
    {
      href: "/cv",
      label: "resume",
      active: pathname === "/cv/",
    },
	{
		href: "/not-work",
		label: "not work",
		active: pathname === "/not-work/" || pathname.startsWith("/not-work/"),
	},
    {
      href: "https://alessiorubicini.medium.com/",
      label: "blog",
      active: false,
      external: true,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Alessio Rubicini</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) =>
              route.external ? (
                <a
                  key={route.href}
                  href={route.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    route.active ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {route.label}
                </a>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    route.active ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {route.label}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between md:justify-end">
          <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
            <span className="font-bold">Alessio Rubicini</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {routes.map((route) =>
                    route.external ? (
                      <a
                        key={route.href}
                        href={route.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "transition-colors hover:text-foreground/80",
                          route.active ? "text-foreground" : "text-foreground/60",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {route.label}
                      </a>
                    ) : (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "transition-colors hover:text-foreground/80",
                          route.active ? "text-foreground" : "text-foreground/60",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {route.label}
                      </Link>
                    ),
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

