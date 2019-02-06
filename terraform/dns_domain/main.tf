# module definition for "dns_domain"
variable "domain_parts" { # split(".",domain) to create a list
  type = "list"
}
variable "parts_count" {} # ~= length(split(".",domain))
output "root_dns" {
  value = "${var.domain_parts[var.parts_count - 2]}.${var.domain_parts[var.parts_count - 1]}"
}