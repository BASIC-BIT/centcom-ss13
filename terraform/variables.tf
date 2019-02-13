variable "access_key" {
  description = "AWS Access Key"
}

variable "secret_key" {
  description = "AWS Secret Token"
}

variable "site_url" {
  description = "The base url of the site (*.thing will be used for registration, only use domains)"
  default = "centcom.services"
}

variable "vanity_urls" {
  type = "list"
  description = "List of other domains that should have a reverse proxy to site_url"
  default = ["centcom13.com"]
}

variable "server_subdomains" {
  type = "list"
  description = "List of subdomains used for servers - this should be deprecated eventually and should be managed in the database"
  default = ["yogstation", "st13"]
}

variable "bash" {
  description = "Bash runner for SSL cert"
  default = "bash"
}

variable "prod_lambda_deploy_version" {
  description = "Version of lambda to deploy to production"
  default = "0.0.5"
}

variable "dev_lambda_deploy_version" {
  description = "Version of lambda to deploy to development"
  default = "0.0.5"
}