output "project_id" {
  value = vercel_project.site.id
}

output "project_url" {
  value = "https://${vercel_project.site.name}.vercel.app"
}

output "domain" {
  value = vercel_project_domain.apex.domain
}
