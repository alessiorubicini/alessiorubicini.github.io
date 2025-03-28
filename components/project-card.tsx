"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/translations"

interface Project {
  id: number
  title: string
  description: string
additional?: string,
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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="bg-muted px-6 py-3">
        <p className="text-sm text-muted-foreground">
          {project.type} • {project.context}
        </p>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground mb-4">{project.description}</p>
		<p className="text-muted-foreground mb-4">{project.additional}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
         View Project <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}

