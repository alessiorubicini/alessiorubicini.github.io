"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useTranslation } from "@/lib/translations"

interface BreadcrumbProps {
  items: {
    label: string
    href: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation()

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4 mr-1" />
        <span className="sr-only">Home</span>
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/not-work" className="hover:text-foreground transition-colors">
        Not Work
      </Link>

      {items.map((item, index) => (
        <span key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            href={item.href}
            className={
              index === items.length - 1 ? "font-medium text-foreground" : "hover:text-foreground transition-colors"
            }
          >
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  )
}

