# file: infra/variables.tf

variable "vercel_api_token" {
  type        = string
  description = "Vercel API Token"
  sensitive   = true
}

variable "vercel_team_id" {
  type        = string
  description = "Vercel team ID that will own the project"
  sensitive   = true
}

variable "vercel_project_name" {
  type        = string
  description = "Name of the Vercel project managed by Terraform"
  default     = "devops-project"
}

variable "game_score_api_url" {
  type        = string
  description = "Public API URL for the leaderboard endpoint"
  default     = ""
}