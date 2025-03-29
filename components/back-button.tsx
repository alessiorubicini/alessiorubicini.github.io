"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
}

export function BackButton({ href = "/not-work" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button variant="ghost" size="sm" className="mb-6 pl-0 hover:bg-transparent" onClick={handleClick}>
      <ChevronLeft className="mr-1 h-4 w-4" />
      <span>Back</span>
    </Button>
  )
}

