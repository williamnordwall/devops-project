variable "vercel_token" {
  description = "Vercel API token used by Terraform"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the Vercel project"
  type        = string
  default     = "jetswim-octopus"
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format"
  type        = string
  default     = "your-github-user/devops-project"
}

variable "domain_name" {
  description = "Custom domain for the site"
  type        = string
  default     = "example.com"
}

variable "aws_region" {
  description = "AWS region for Route53 resources"
  type        = string
  default     = "us-east-1"
}

variable "manage_dns" {
  description = "Whether Terraform should manage DNS records in Route53"
  type        = bool
  default     = false
}
