"use client"
import { ProjectCard } from "@/components/project-card"
import { useTranslation } from "@/lib/translations"
import { useEffect, useState } from "react"

export default function ProjectsPage() {
	const { t } = useTranslation()
	const [mounted, setMounted] = useState(false)
	
	// Ensure component is mounted before rendering to avoid hydration issues
	useEffect(() => {
		setMounted(true)
	}, [])
	
	if (!mounted) {
		return null
	}
	
	const projects = [
		{
			id: 1,
			title: "📑 Screenplay Genie",
			description: "An educational iOS app designed to teach users the fundamentals of screenwriting. It features interactive lessons, live previews of scripts in proper screenplay format, and a free writing playground with support for Fountain Markdown.",
			technologies: ["Swift", "SwiftUI"],
			link: "https://github.com/alessiorubicini/Screenplay-Genie",
			type: "iOS Application",
			context: "Winner of Apple Swift Student Challenge 2025",
		},
		{
			id: 2,
			title: "🐦‍🔥 Swift Sessions",
			description: "A comprehensive Swift package that implements binary session types, providing a robust framework for ensuring safe and structured communication in concurrent systems.",
			additional: "Cited on Episode #46 of the Swift Package Indexing podcast.",
			technologies: ["Swift"],
			link: "https://github.com/alessiorubicini/SwiftSessions",
			type: "Swift Package",
			context: "Bachelor’s Degree Thesis Project",
		},
		{
			id: 3,
			title: "🔍 SF Symbols Picker for SwiftUI",
			description: "A SwiftUI package that provides an easy-to-use picker for selecting SF Symbols in iOS and macOS apps. It supports seamless symbol selection with binding integration and customization options.",
			technologies: ["Swift", "SwiftUI"],
			link: "https://github.com/alessiorubicini/SFSymbolsPickerForSwiftUI",
			type: "Swift Package",
			context: "Open Source Project",
		},
		{
			id: 4,
			title: "🏝️ Island Alerts for SwiftUI",
			description: "A SwiftUI package offering various alert styles designed to integrate smoothly with the iPhone’s Dynamic Island and Notch. It provides customizable alerts like large, medium, and square sizes for Dynamic Island, and similar options for the Notch.",
			technologies: ["Swift", "SwiftUI"],
			link: "https://github.com/alessiorubicini/IslandAlertsForSwiftUI",
			type: "Swift Package",
			context: "Open Source Project",
		},
		{
			id: 5,
			title: "📍 Location Picker for SwiftUI",
			description: "A SwiftUI package providing an interactive view for selecting geographic coordinates. It allows users to select a location on a map, with real-time coordinate display and easy integration via SwiftUI bindings.",
			technologies: ["Swift", "SwiftUI", "MapKit"],
			link: "https://github.com/alessiorubicini/LocationPickerForSwiftUI",
			type: "Swift Package",
			context: "Open Source Project",
		},
		{
			id: 6,
			title: "✏️ Pencil Drawer for SwiftUI",
			description: "A SwiftUI package enabling users to draw within apps using a simple interface. It simplifies the integration of PencilKit by using SwiftUI’s binding system to handle drawing data.",
			technologies: ["Swift", "SwiftUI", "PencilKit"],
			link: "https://github.com/alessiorubicini/PencilDrawerForSwiftUI",
			type: "Swift Package",
			context: "Open Source Project",
		},
		{
			id: 7,
			title: "🛒 GameZen",
			description: "An iOS client-side app for a board game e-commerce store. The app allows a complete customer-seller interaction with registration, catalog consultation, purchase and order tracking. Created as a project for my high school final exam.",
			technologies: ["Swift", "SwiftUI", "PHP", "MySQL"],
			link: "https://github.com/alessiorubicini/GameZen-iOS",
			type: "iOS Application",
			context: "High School Final Exam Project",
		},
	]
	
	return (
		<div className="container px-4 md:px-6 py-12">
      		<div className="flex flex-col gap-8 max-w-3xl mx-auto">
        		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          			<div>
            			<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Projects</h1>
            			<p className="text-muted-foreground mt-2">A collection of applications and other software projects I've developed throughout my journey.</p>
          			</div>
        		</div>

				{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
			</div>
		</div>
	)
}

