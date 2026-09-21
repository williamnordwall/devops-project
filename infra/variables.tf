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

variable "domain_name" {
  type        = string
  description = "Domain to manage on the existing Vercel project"
  default     = "example.com"
}