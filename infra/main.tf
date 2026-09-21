# file: infra/main.tf

terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 4.0.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

# This project already exists in Vercel.
# Terraform is managing the existing project instead of creating a new one.
# Import it once in Terraform state if it is not already there:
# terraform import vercel_project_environment_variable.node_env <project-id>,<key>

resource "vercel_project_environment_variable" "node_env" {
  project_id = var.vercel_project_id
  key        = "NODE_ENV"
  value      = "production"
  target     = ["production"]
}

resource "vercel_project_domain" "apex" {
  project_id = var.vercel_project_id
  domain     = var.domain_name
}
