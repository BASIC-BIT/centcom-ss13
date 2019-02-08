provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "us-east-1"
}

resource "aws_eip" "public_ip" {
  instance = "${aws_instance.ui.id}"
}

resource "aws_instance" "ui" {
  ami = "ami-2757f631"
  instance_type = "t2.micro"

  provisioner "local-exec" {
    command = "echo ${aws_instance.ui.public_ip} > ip_address.txt"
  }
}

module "dns_domain" {
  source = "./dns_domain" # path to the module folder
  domain_parts = "${split(".",var.site_url)}"
  parts_count = "${length(split(".",var.site_url))}"
}

# Issue a CLI call to get a cert. Re-requests just return the ARN
data "external" "cert_request" {
  program = ["${var.bash}", "./req_cert.sh"]
  query = {
    cert_domain = "${var.cert_domain}"
  }
}

# s3 Bucket with Website settings
resource "aws_s3_bucket" "site_bucket" {
  bucket = "${var.site_url}"
  acl = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"

    routing_rules = <<EOF
[]
EOF
  }
}
# Route53 Domain Name & Resource Records
resource "aws_route53_zone" "site_zone" {
  name = "${module.dns_domain.root_dns}"
}
resource "aws_route53_record" "site_ns" {
  zone_id = "${aws_route53_zone.site_zone.zone_id}"
  name = "${module.dns_domain.root_dns}"
  type = "NS"
  ttl = "30"
  records = [
    "${aws_route53_zone.site_zone.name_servers.0}",
    "${aws_route53_zone.site_zone.name_servers.1}",
    "${aws_route53_zone.site_zone.name_servers.2}",
    "${aws_route53_zone.site_zone.name_servers.3}"
  ]
}
# Create a "static." cName to point to the s3 bucket
resource "aws_route53_record" "site_cname_static" {
  zone_id = "${aws_route53_zone.site_zone.zone_id}"
  name = "static.${module.dns_domain.root_dns}"
  type = "CNAME"
  ttl = "30"
  records = [
    "${aws_s3_bucket.site_bucket.bucket_domain_name}"
  ]
}
# Create a CName for our site_name and point to cloudfront
resource "aws_route53_record" "site_cname" {
  zone_id = "${aws_route53_zone.site_zone.zone_id}"
  name = "${var.site_url}"
  type = "CNAME"
  ttl = "30"
  records = [
    "${aws_cloudfront_distribution.site_distribution.domain_name}"
  ]
}

# cloudfront distribution
resource "aws_cloudfront_distribution" "site_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.site_bucket.bucket_domain_name}"
    origin_id = "${var.site_url}-origin"
  }
  enabled = true
  aliases = ["${var.site_url}"]
  price_class = "PriceClass_100"
  default_root_object = "index.html"
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH",
      "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.site_url}-origin"
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 1000
    max_ttl                = 86400
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = "${data.external.cert_request.result.CertificateArn}"
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016" # defaults wrong, set
  }
}