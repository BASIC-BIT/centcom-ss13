output "server_url" {
  value = "${aws_api_gateway_deployment.centcom-server-api-deployment.invoke_url}"
}

output "client_url" {
  value = "${aws_s3_bucket.site_bucket.website_endpoint}"
}

output "mysql_url" {
  value = "${aws_db_instance.maindb.address}"
}

output "client_cloudfront_url" {
  value = "${aws_cloudfront_distribution.site_distribution.domain_name}"
}