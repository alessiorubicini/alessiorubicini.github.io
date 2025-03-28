type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

export const translations: Translations = {
  // Navigation
  "nav.home": {
    en: "Home",
    it: "Home",
  },
  "nav.projects": {
    en: "Projects",
    it: "Progetti",
  },
  "nav.resume": {
    en: "Resume",
    it: "Curriculum",
  },
  "nav.blog": {
    en: "Blog",
    it: "Blog",
  },

  // Home page

  "home.viewProjects": {
    en: "View My Projects",
    it: "Visualizza i Miei Progetti",
  },
  "home.myResume": {
    en: "My Resume",
    it: "Il Mio Curriculum",
  },
  "home.readBlog": {
    en: "Read My Blog",
    it: "Leggi il Mio Blog",
  },


  // CV/Resume page
  "cv.title": {
    en: "Resume",
    it: "Curriculum Vitae",
  },
  "cv.subtitle": {
    en: "iOS Developer & Computer Science Student",
    it: "Sviluppatore iOS e Studente di Informatica",
  },
  "cv.download": {
    en: "Download PDF",
    it: "Scarica PDF",
  },
  "cv.presentation": {
	en: "Presentation",
	it: "Presentazione"
  },
  "cv.education": {
    en: "Education",
    it: "Formazione",
  },
  "cv.experience": {
    en: "Experience",
    it: "Esperienza",
  },
  "cv.skills": {
    en: "Skills",
    it: "Competenze",
  },
  "cv.awards": {
    en: "Awards & Achievements",
    it: "Premi e Riconoscimenti",
  },
  "cv.languages": {
    en: "Programming Languages",
    it: "Linguaggi di Programmazione",
  },
  "cv.frameworks": {
    en: "Frameworks & Technologies",
    it: "Framework e Tecnologie",
  },
  "cv.tools": {
    en: "Tools",
    it: "Strumenti",
  },
  "cv.languageSkills": {
    en: "Language Skills",
    it: "Competenze Linguistiche",
  },
  "cv.softSkills": {
    en: "Soft Skills",
    it: "Competenze Trasversali",
  },
  "cv.hobbies": {
    en: "Hobbies & Interests",
    it: "Hobby e Interessi",
  },
  "cv.fieldOfStudy": {
	en: "Field of Study",
	it: "Campo di Studio"
  },
  "cv.finalMark": {
    en: "Final Mark:",
    it: "Voto Finale:",
  },
  "cv.thesis": {
    en: "Thesis:",
    it: "Tesi:",
  },
  "cv.viewThesis": {
    en: "View Thesis",
    it: "Visualizza Tesi",
  },



  // Footer
  "footer.rights": {
    en: "All rights reserved.",
    it: "Tutti i diritti riservati.",
  },
  "footer.lastUpdate": {
    en: "Last updated:",
    it: "Ultimo aggiornamento:",
  },
}

export function useTranslation() {
  const getTranslation = (key: string, lang = "en"): string => {
    // Get language from localStorage if available, otherwise use provided lang
    const currentLang = typeof window !== "undefined" ? localStorage.getItem("language") || lang : lang

    if (translations[key] && translations[key][currentLang]) {
      return translations[key][currentLang]
    }

    // Fallback to English if translation not found
    if (translations[key] && translations[key]["en"]) {
      return translations[key]["en"]
    }

    // Return the key if no translation found
    return key
  }

  return { t: getTranslation }
}

