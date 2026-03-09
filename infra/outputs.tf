# --- Outputs ---

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.eligibility_api.function_name
}

output "citizen_profiles_table" {
  description = "DynamoDB table for citizen profiles"
  value       = aws_dynamodb_table.citizen_profiles.name
}

output "consent_records_table" {
  description = "DynamoDB table for consent records"
  value       = aws_dynamodb_table.consent_records.name
}

output "scheme_rules_bucket" {
  description = "S3 bucket for scheme rules"
  value       = aws_s3_bucket.scheme_rules.id
}

output "sns_topic_arn" {
  description = "SNS topic ARN for citizen notifications"
  value       = aws_sns_topic.citizen_alerts.arn
}

output "s3_frontend_bucket" {
  description = "S3 bucket for frontend hosting"
  value       = aws_s3_bucket.frontend.id
}
