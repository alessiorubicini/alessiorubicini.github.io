"use client"

import { useTranslation } from "@/lib/translations"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MusicIcon, Film, BookOpen, PenTool, Camera, Video, Star, Gamepad2, ExternalLink, Tv } from "lucide-react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import interestsData from "./interests.json"
import { Button } from "@/components/ui/button"

interface InterestCardProps {
  title: string
  description: string
  image: string
  alt: string
  icon: LucideIcon
}

function InterestCard({ title, description, image, alt, icon: Icon }: InterestCardProps) {
    return (
        <Card className="flex overflow-hidden">
            {/* Image Section */}
            <div className="w-1/3 relative">
                <Image
                    src={image || "/assets/placeholders/placeholder.svg"}
                    alt={alt}
                    width={300}
                    height={300}
                    className="object-contain h-auto"
                />
            </div>

            {/* Content Section */}
            <div className="w-2/3 p-4">
                <CardHeader className="pb-2">
                    <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-bold text-lg">{title}</h3>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{description}</p>
					{title.toLowerCase().includes("movie") && (
						<Button asChild className="rounded-full">
							<Link href="https://letterboxd.com/alessiorubicini" target="_blank" rel="noopener noreferrer">
								Visit my Letterboxd <ExternalLink className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					)}
                </CardContent>
            </div>
        </Card>
    )
}

export default function NotWorkClientPage() {
	const { t } = useTranslation()
	const [mounted, setMounted] = useState(false)
	
	// Ensure component is mounted before rendering to avoid hydration issues
	useEffect(() => {
		setMounted(true)
	}, [])
	
	if (!mounted) {
		return null
	}
	
	// Map icon strings to LucideIcon components
	const iconMap: Record<string, LucideIcon> = { BookOpen, Film, PenTool, MusicIcon, Gamepad2, Camera, Video, Star, Tv }
	
	const interests = interestsData.map((interest) => ({
		...interest,
		icon: iconMap[interest.icon],
	}))

  	return (
    	<div className="container px-4 md:px-6 py-12">
			<div className="flex flex-col gap-8 max-w-3xl mx-auto">
			  	<div className="flex flex-col items-center text-center">
        			<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">not work.</h1>
        			<p className="text-muted-foreground max-w-[700px] mb-8 text-lg">
          				A glimpse into my current personal interests and activities outside of work.
        			</p>
      			</div>

	    		<div className="max-w-3xl mx-auto space-y-8">
					{interests.map((interest, index) => (
						<InterestCard
							key={index}
							title={interest.title}
							description={interest.description}
							image={interest.image}
							alt={interest.alt}
							icon={interest.icon}
						/>
					))}
      			</div>
			</div>
    	</div>
  	)
}

