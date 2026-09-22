# file: infra/variables.tf

variable "vercel_api_token" {
  type        = string
  description = "Vercel API Token"
  sensitive   = true
}

variable "vercel_project_id" {
  type        = string
  description = "Vercel project ID for the existing project"
  sensitive   = true
}

variable "database_url" {
  type        = string
  description = "Database connection string used by the game leaderboard API"
  default     = ""
  sensitive   = true
}

variable "game_score_api_url" {
  type        = string
  description = "Public API URL for the leaderboard endpoint"
  default     = ""
}