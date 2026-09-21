terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_token
}

provider "aws" {
  region = var.aws_region
}

resource "vercel_project" "site" {
  name      = var.project_name
  framework = "other"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  production_branch = "main"
}

resource "vercel_project_environment_variable" "node_env" {
  project_id = vercel_project.site.id
  key        = "NODE_ENV"
  value      = "production"
  target     = ["production"]
}

resource "vercel_project_domain" "apex" {
  project_id = vercel_project.site.id
  domain     = var.domain_name
}

resource "vercel_project_domain" "www" {
  project_id = vercel_project.site.id
  domain     = "www.${var.domain_name}"
}

resource "aws_route53_zone" "primary" {
  count = var.manage_dns ? 1 : 0
  name  = var.domain_name
}

resource "aws_route53_record" "apex_a" {
  count   = var.manage_dns ? 1 : 0
  zone_id = aws_route53_zone.primary[0].zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = ["76.76.21.21"]
}

resource "aws_route53_record" "www_cname" {
  count   = var.manage_dns ? 1 : 0
  zone_id = aws_route53_zone.primary[0].zone_id
  name    = "www"
  type    = "CNAME"
  ttl     = 300
  records = ["cname.vercel-dns.com"]
}
