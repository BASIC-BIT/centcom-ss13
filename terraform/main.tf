provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region = "us-east-1"
}

resource "aws_db_instance" "maindb" {
  allocated_storage    = 10
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name                 = "mydb"
  username             = "admin"
  password             = "heythispasswordwontworkanymoreidiot"
  parameter_group_name = "default.mysql5.7"
}

module "dns_domain" {
  source = "./dns_domain" # path to the module folder
  domain_parts = "${split(".",var.site_url)}"
  parts_count = "${length(split(".",var.site_url))}"
}

# Issue a CLI call to get a cert. Re-requests just return the ARN
#data "external" "cert_request" {
#  program = ["${var.bash}", "./req_cert.sh"]
#  query = {
#    cert_domain = "*.${var.site_url}"
#  }
#}

#CLI cert for all other vanity URLs
#data "external" "cert_request_vanity" {
#  count = "${length(var.vanity_urls)}"
#  program = ["${var.bash}", "./req_cert.sh"]
#  query = {
#    cert_domain = "*.${element(var.vanity_urls, count.index)}"
#  }
#}

# s3 Bucket with Website settings
resource "aws_s3_bucket" "site_bucket" {
  bucket = "${var.site_url}"
  acl = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}
resource "aws_s3_bucket" "centcom-server-staging" {
  bucket = "centcom-server-staging"
  acl = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_example_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "server_lambda" {
  function_name = "CentComServer"

  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = "${aws_s3_bucket.centcom-server-staging.bucket}"
  s3_key    = "server.zip"

  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "bundle.handler"
  runtime = "nodejs6.10"

  role = "${aws_iam_role.lambda_exec.arn}"
}

resource "aws_api_gateway_rest_api" "centcom-server-api" {
  name        = "CentcomServerApi"
  description = "CentCom Server API"
}

resource "aws_api_gateway_resource" "centcom-server-api-proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.centcom-server-api.id}"
  parent_id   = "${aws_api_gateway_rest_api.centcom-server-api.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "centcom-server-api-proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.centcom-server-api.id}"
  resource_id   = "${aws_api_gateway_resource.centcom-server-api-proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "centcom-server-api-proxy-lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.centcom-server-api.id}"
  resource_id = "${aws_api_gateway_method.centcom-server-api-proxy.resource_id}"
  http_method = "${aws_api_gateway_method.centcom-server-api-proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.server_lambda.invoke_arn}"
}

resource "aws_api_gateway_method" "centcom-server-api-proxy-root" {
  rest_api_id   = "${aws_api_gateway_rest_api.centcom-server-api.id}"
  resource_id   = "${aws_api_gateway_rest_api.centcom-server-api.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "centcom-server-api-proxy-lambda-root" {
  rest_api_id = "${aws_api_gateway_rest_api.centcom-server-api.id}"
  resource_id = "${aws_api_gateway_method.centcom-server-api-proxy-root.resource_id}"
  http_method = "${aws_api_gateway_method.centcom-server-api-proxy-root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.server_lambda.invoke_arn}"
}

resource "aws_api_gateway_deployment" "centcom-server-api-deployment" {
  depends_on = [
    "aws_api_gateway_integration.centcom-server-api-proxy-lambda",
    "aws_api_gateway_integration.centcom-server-api-proxy-lambda-root",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.centcom-server-api.id}"
  stage_name  = "test"
}

resource "aws_lambda_permission" "centcom-server-api-lambda-permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.server_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.centcom-server-api-deployment.execution_arn}/*/*"
}
resource "aws_lambda_alias" "centcom-server-lambda-alias" {
  name             = "centcom-server-lambda-alias"
  description      = "a thing"
  function_name    = "${aws_lambda_function.server_lambda.function_name}"
  function_version = "$LATEST"
}

output "base_url" {
  value = "${aws_api_gateway_deployment.centcom-server-api-deployment.invoke_url}"
}

data "aws_acm_certificate" "main_cert" {
  domain   = "*.${var.site_url}"
  statuses = ["ISSUED"]
}

data "aws_acm_certificate" "vanity_certs" {
  count = "${length(var.vanity_urls)}"
  domain   = "*.${element(var.vanity_urls, count.index)}"
  statuses = ["ISSUED"]
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

# Create an alias for our site_name and point to cloudfront
resource "aws_route53_record" "subdomain_a_records" {
  count = "${length(var.server_subdomains)}"
  zone_id = "${aws_route53_zone.site_zone.zone_id}"
  name = "${element(var.server_subdomains, count.index)}.${var.site_url}"
  type = "A"
  alias = {
    name                   = "${aws_cloudfront_distribution.site_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.site_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "root_a_record" {
  zone_id = "${aws_route53_zone.site_zone.zone_id}"
  name = "${var.site_url}"
  type = "A"
  alias = {
    name                   = "${aws_cloudfront_distribution.site_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.site_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "root_www_a_record" {
  zone_id = "${aws_route53_zone.site_zone.zone_id}"
  name = "www.${var.site_url}"
  type = "A"
  alias = {
    name                   = "${aws_cloudfront_distribution.site_distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.site_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}

# cloudfront distribution
resource "aws_cloudfront_distribution" "site_distribution" {
  origin {
    // We need to set up a "custom" origin because otherwise CloudFront won't
    // redirect traffic from the root domain to the www domain, that is from
    // runatlantis.io to www.runatlantis.io.
    custom_origin_config {
      // These are all the defaults.
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    domain_name = "${aws_s3_bucket.site_bucket.bucket_domain_name}"
    origin_id = "${var.site_url}-origin"
  }
  enabled = true
  aliases = "${concat(formatlist("%s.%s", var.server_subdomains, var.site_url), list(var.site_url, "www.${var.site_url}"))}"
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
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
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
    acm_certificate_arn = "${data.aws_acm_certificate.main_cert.arn}"
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016" # defaults wrong, set
  }
}