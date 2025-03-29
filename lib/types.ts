// Cinema & TV Series types
export interface Movie {
  id: string
  title: string
  year: number
  genre: string
  coverImage: string
  rating: number
  comment?: string
  letterboxdLink?: string
}

export interface TVShow {
  id: string
  title: string
  year: number
  genre: string
  coverImage: string
  rating: number
  comment?: string
  seasons?: number
  watches?: number
}

// Books types
export interface Book {
  id: string
  title: string
  author: string
  genre: string
  coverImage: string
  rating: number
  comment?: string
  dateRead?: string
}

// Writing types
export interface Story {
  id: string
  title: string
  type: string
  summary: string
  link: string
}

// Photography types
export interface PhotoProject {
  id: string
  title: string
  date: string
  location: string
  photos: Photo[]
}

export interface Photo {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

// Videomaking types
export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  youtubeId: string
}

// Music types
export interface Playlist {
  id: string
  title: string
  spotifyId: string
  comment: string
}

// Astronomy types
export interface AstronomyEntry {
  id: string
  title: string
  date: string
  subtitle: string
  content: string
}

// Videogames types
export interface Game {
  id: string
  title: string
  platform: string
  genre: string
  coverImage: string
  rating: number
  comment?: string
  year: number
}

