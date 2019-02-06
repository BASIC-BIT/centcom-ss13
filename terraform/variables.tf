variable "access_key" {
  description = "AWS Access Key"
}

variable "secret_key" {
  description = "AWS Secret Token"
}

variable "site_url" {
  description = "The base url of the site"
  default = "yogs.ddmers.com"
}

variable "cert_domain" {
  description = "The SSL registered domain"
  default = "*.ddmers.com"
}

variable "bash" {
  description = "Bash runner for SSL cert"
  default = "bash"
}