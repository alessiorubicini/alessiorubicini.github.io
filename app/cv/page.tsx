"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { useTranslation } from "@/lib/translations"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function CVPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Resume</h1>
            <p className="text-muted-foreground mt-2">Computer Science Student & iOS Developer</p>
          </div>
		  <Button 
			className="rounded-full" 
			onClick={() => {
			  const link = document.createElement("a");
			  link.href = "/CV[ENG]-AlessioRubicini-Feb2025.pdf";
			  link.download = "CV[ENG]-AlessioRubicini-Feb2025";
			  link.click();
			}}
		  >
			<Download className="mr-2 h-4 w-4"/> Download PDF
		  </Button>
        </div>

		<Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">👋🏻 Hi! I'm Alessio</h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="flex justify-between">
                
                <span className="text-muted-foreground">I study Computer Science (Software Development and Technologies) at the University of Camerino, where I graduated in Computer Science for Digital Communication. I love leveraging the potential of today’s technologies to develop applications and software solutions that improve people’s lives and have a positive impact on the world. My area of interest is software development on Apple platforms, but I also enjoy experimenting with new technologies, environments, and tools.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">🎓 Education</h2>
          </CardHeader>
          <CardContent className="grid gap-6">
		  	<div>
              <div className="flex justify-between">
                <h3 className="font-semibold">Master Degree in Computer Science, Software Development & Technologies</h3>
                <span className="text-muted-foreground">2024 - Now</span>
              </div>
              <p className="text-muted-foreground">University of Camerino, Camerino, Italy</p>
              <div className="mt-2 space-y-2">
                
   
              </div>
            </div>

			<div>
              <div className="flex justify-between">
                <h3 className="font-semibold">Bachelor Degree in Computer Science for Digital Communication</h3>
                <span className="text-muted-foreground">2021 - 2024</span>
              </div>
              <p className="text-muted-foreground">University of Camerino, Camerino, Italy</p>
              <div className="mt-2 space-y-2">
                
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Final Mark:</span> 109/110
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium">Thesis:</p>
                    <Link
                      href="/Tesi_Alessio_Rubicini.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      <i>Design and implementation of a binary sessions library in the Swift language</i> <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

			<div>
              <div className="flex justify-between">
                <h3 className="font-semibold">High School Diploma in Computer Science</h3>
                <span className="text-muted-foreground">2016 - 2021</span>
              </div>
              <p className="text-muted-foreground">I.T.T. “G. & M. Montani”, Fermo, Italy</p>
              <div className="mt-2 space-y-2">
                
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Final Mark:</span> 100/100
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium">Thesis:</p>
                    <Link
                      href="/Sviluppo%20iOS.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      <i>iOS development: the iOS system and the creation of an app</i> <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">👨🏻‍💻 Experience</h2>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <div className="flex justify-between">
                <h3 className="font-semibold">iOS Developer Intern</h3>
                <span className="text-muted-foreground">March 2024 - May 2024</span>
              </div>
              <p className="text-muted-foreground">AppLoad SRL, Corridonia, Italy</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Assisted the iOS team with maintenance and minor feature implementations.</li>
                <li>Progressed to developing full applications, focusing on architecture and UI.</li>
                <li>Enhanced skills in Swift and SwiftUI, and gained experience with UIKit.</li>
                
              </ul>
            </div>
			<div>
              <div className="flex justify-between">
                <h3 className="font-semibold">Indie iOS Developer</h3>
                <span className="text-muted-foreground">July 2020 - Now</span>
              </div>
              <p className="text-muted-foreground">Self-Employed</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Developed multiple iOS apps, focusing on Swift and SwiftUI.</li>
                <li>Built and maintained open-source Swift packages, with more than 100 GitHub stars.</li>
                
              </ul>
            </div>
          </CardContent>
        </Card>

		<Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">🥇 Awards & Achievements</h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="flex justify-between">
                <h3 className="font-semibold">Apple Swift Student Challenge Winner</h3>
                <span className="text-muted-foreground">2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">🎯 Skills</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold mb-2">Programming Languages</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Swift</Badge>
                  <Badge>Python</Badge>
                  <Badge>JavaScript</Badge>
				  <Badge>TypeScript</Badge>
                  <Badge>Java</Badge>
                  <Badge>C++</Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Frameworks & Technologies</h3>
                <div className="flex flex-wrap gap-2">
					<Badge>SwiftUI</Badge>
				  	<Badge>UIKit</Badge>
					<Badge>Node.js</Badge>
					<Badge>Angular</Badge>
					<Badge>Git</Badge>
					<Badge>MySQL</Badge>
                  	<Badge>REST APIs</Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Xcode</Badge>
				  <Badge>Postman</Badge>
                  <Badge>Figma</Badge>
                  <Badge>LaTeX</Badge>
				  <Badge>Final Cut Pro</Badge>
				  <Badge>Notion</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">🗣️ Language Skills</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
			<div className="flex justify-between items-center">
                <span className="font-medium">Italian</span>
                <Badge variant="outline">Native</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">English</span>
                <Badge variant="outline">B2 (Upper-Intermediate)</Badge>
              </div>
              
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">🤝 Soft Skills</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Problem Solving</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Team Collaboration</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Time Management</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Critical Thinking</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Adaptability</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Communication</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Leadership</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Creativity</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">🎨 Hobbies & Interests</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge>Cinema</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Creative Writing</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Photography</Badge>
              </div>
			  <div className="flex items-center gap-2">
                <Badge>Filmmaking</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Reading</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Horror Literature</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Astronomy</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Videogames</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}

