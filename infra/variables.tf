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