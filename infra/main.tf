# file: infra/main.tf

terraform {
  backend "remote" {
    organization = "kth-devops-project"

    workspaces {
      name = "devops-project"
    }
  }

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
# Import the existing environment variable once before managing it with Terraform:
# terraform import vercel_project_environment_variable.node_env <project-id>,NODE_ENV
resource "vercel_project_environment_variable" "node_env" {
  project_id = var.vercel_project_id
  key        = "NODE_ENV"
  value      = "production"
  target     = ["production"]
}

