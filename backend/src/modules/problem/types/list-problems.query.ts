export interface ListProblemsQuery {
  page?: number
  limit?: number
  search?: string
  difficulty?: "easy" | "medium" | "hard"
  tag?: string
  isPremium?: boolean
  isActive?: boolean
  sortBy?: "createdAt" | "difficulty" | "title"
  sortOrder?: "asc" | "desc"
}