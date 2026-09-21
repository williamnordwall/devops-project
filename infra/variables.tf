# file: infra/variables.tf

variable "vercel_api_token" {
  type        = string
  description = "Vercel API Token"
  sensitive   = true
}