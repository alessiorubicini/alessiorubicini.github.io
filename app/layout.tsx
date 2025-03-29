import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Alessio Rubicini",
  description: "Portfolio of Alessio Rubicini, iOS Developer and Computer Science Student",
  generator: 'v0.dev'
}

// Set the last update date
const lastUpdateDate = "March 29, 2025"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
	<head>
        
        
        <link rel="icon" type="image/png" href="/assets/images/alememoji.png" />
        
      </head>

      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Alessio Rubicini. <span id="rights-reserved">All rights reserved.</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  <span id="last-update">Last updated:</span> {lastUpdateDate}
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Initialize language
            const savedLang = localStorage.getItem("language") || "en";
            document.documentElement.lang = savedLang;
            
            // Translate footer text
            function updateFooterText() {
              const lang = localStorage.getItem("language") || "en";
              const rightsElement = document.getElementById("rights-reserved");
              const lastUpdateElement = document.getElementById("last-update");
              
              if (rightsElement) {
                rightsElement.textContent = lang === "it" ? "Tutti i diritti riservati." : "All rights reserved.";
              }
              
              if (lastUpdateElement) {
                lastUpdateElement.textContent = lang === "it" ? "Ultimo aggiornamento:" : "Last updated:";
              }
            }
            
            // Run on load
            updateFooterText();
            
            // Listen for storage changes (language switch)
            window.addEventListener("storage", function(e) {
              if (e.key === "language") {
                updateFooterText();
              }
            });
          `,
          }}
        />
      </body>
    </html>
  )
}



import './globals.css'