# file: infra/main.tf

terraform {
  backend "remote" {
    organization = "kth-devops-project"

    workspaces {
      name = "devops-project-2"
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
# Import the existing environment variable once before managing it with Terraform.
# The Vercel provider requires the environment-variable ID, not the key name.
# For example: terraform import vercel_project_environment_variable.node_env <project-id>/<env-var-id>
resource "vercel_project_environment_variable" "node_env" {
  project_id = var.vercel_project_id
  key        = "NODE_ENV"
  value      = "production"
  target     = ["production"]
}

resource "vercel_project_environment_variable" "database_url" {
  project_id = var.vercel_project_id
  key        = "DATABASE_URL"
  value      = var.database_url == "" ? "postgres://placeholder.invalid/scoreboard" : var.database_url
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "game_score_api_url" {
  project_id = var.vercel_project_id
  key        = "GAME_SCORE_API_URL"
  value      = var.game_score_api_url == "" ? "https://placeholder.example/api/high-score" : var.game_score_api_url
  target     = ["production"]
}

