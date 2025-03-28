"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitch() {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState<string>("en")

  useEffect(() => {
    // Get language from localStorage or default to English
    const savedLang = localStorage.getItem("language") || "en"
    setCurrentLang(savedLang)
    document.documentElement.lang = savedLang
  }, [])

  const switchLanguage = (lang: string) => {
    localStorage.setItem("language", lang)
    setCurrentLang(lang)
    document.documentElement.lang = lang

    // Force a refresh to update all content
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("en")} className={currentLang === "en" ? "bg-muted" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("it")} className={currentLang === "it" ? "bg-muted" : ""}>
          Italiano
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

