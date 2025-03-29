import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface InterestCardProps {
	title: string
	href: string
	icon: LucideIcon
}

export function InterestCard({ title, href, icon: Icon }: InterestCardProps) {
	return (
		<Link
			href={href}
			className="flex flex-col items-center justify-center p-6 rounded-lg border bg-card text-card-foreground shadow hover:shadow-md transition-all hover:scale-105"
		>
		<Icon className="h-12 w-12 mb-4 text-primary" />
			<h3 className="text-lg font-medium">{title}</h3>
		</Link>
	)
}

