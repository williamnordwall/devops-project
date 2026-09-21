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

resource "vercel_project" "jetswim_octopus" {
  name = "jetswim-octopus"

  git_repository = {
    type = "github"
    repo = "williamnordwall/devops-project"
  }
}