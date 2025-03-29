"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/translations"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  link: string
  type: string
  context: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation()

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/100 bg-card transition-all hover:shadow-md">
      {/* Project type badge */}
      <div className="absolute right-4 top-4 z-10">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
          {project.type}
        </Badge>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="mb-6 space-y-1">
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground">{project.context}</p>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="bg-background/50">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center px-6 border-t border-border/100">
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-primary hover:underline"
          >
            View Project <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

