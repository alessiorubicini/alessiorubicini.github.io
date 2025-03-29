"use client"
import { ProjectCard } from "@/components/project-card"
import { useTranslation } from "@/lib/translations"
import { useEffect, useState } from "react"
import projectsData from "./projects.json"

interface Project {
	id: number
	title: string
	description: string
	image: string
	alt: string
	link: string
}

export default function ProjectsPage() {
    const [mounted, setMounted] = useState(false)

    // Ensure component is mounted before rendering to avoid hydration issues
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

	const projects = projectsData;

    return (
        <div className="container px-4 md:px-6 py-12">
              <div className="flex flex-col gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">projects.</h1>
                    <p className="text-muted-foreground max-w-[700px] mb-8 text-lg">
                    A collection of software projects I've developed throughout my journey.
                    </p>
                  </div>

                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}

