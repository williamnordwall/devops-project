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

resource "vercel_project" "project" {
  name      = var.vercel_project_name
  team_id   = var.vercel_team_id
  framework = "other"
}

resource "vercel_project_environment_variable" "node_env" {
  project_id = vercel_project.project.id
  key        = "NODE_ENV"
  value      = "production"
  target     = ["production"]
}

resource "vercel_project_environment_variable" "database_url" {
  project_id = vercel_project.project.id
  key        = "DATABASE_URL"
  value      = var.database_url
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "game_score_api_url" {
  project_id = vercel_project.project.id
  key        = "GAME_SCORE_API_URL"
  value      = var.game_score_api_url == "" ? "https://${var.vercel_project_name}.vercel.app/api/high-score" : var.game_score_api_url
  target     = ["production"]
}

