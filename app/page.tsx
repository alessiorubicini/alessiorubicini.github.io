"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/translations"
import { useEffect, useState } from "react"
import { Award } from "lucide-react"

export default function Home() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-8 overflow-hidden rounded-full border-4 border-background bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <Image
            src="/alessio.jpeg"
            alt="Profile picture"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Alessio Rubicini</h1>
        <p className="text-muted-foreground max-w-[700px] mb-4 text-lg">Computer Science Student and iOS Developer. Passionate about creating intuitive, user-friendly applications that solve real-world problems.</p>

        <div className="mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent">
          <Award className="mr-1.5 h-4 w-4" />
          Apple WWDC25 Swift Student Challenge Winner
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link href="https://github.com/alessiorubicini" target="_blank" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link href="https://www.linkedin.com/in/alessiorubicini/" target="_blank" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link href="mailto:alessiorubicini16@icloud.com" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </Button>
		</div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="rounded-full">
            <Link href="/projects">View My Projects</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/cv">My Resume</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="https://alessiorubicini.medium.com/" target="_blank" rel="noopener noreferrer">
              Read My Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

