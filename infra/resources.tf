# --- S3 Buckets ---

resource "aws_s3_bucket" "scheme_rules" {
  bucket = "${var.project_name}-${var.environment}-scheme-rules"
}

resource "aws_s3_bucket_versioning" "scheme_rules" {
  bucket = aws_s3_bucket.scheme_rules.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "scheme_rules" {
  bucket = aws_s3_bucket.scheme_rules.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "aws:kms" }
  }
}

resource "aws_s3_bucket_public_access_block" "scheme_rules" {
  bucket                  = aws_s3_bucket.scheme_rules.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# --- DynamoDB Tables ---

resource "aws_dynamodb_table" "citizen_profiles" {
  name         = "HaqDaariCitizenProfiles${title(var.environment)}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "citizenId"

  attribute {
    name = "citizenId"
    type = "S"
  }

  attribute {
    name = "phone"
    type = "S"
  }

  global_secondary_index {
    name            = "PhoneLookup"
    hash_key        = "phone"
    projection_type = "ALL"
  }

  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true }
}

resource "aws_dynamodb_table" "consent_records" {
  name         = "HaqDaariConsentRecords${title(var.environment)}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "consentId"

  attribute {
    name = "consentId"
    type = "S"
  }

  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

# --- IAM Role for Lambda ---

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "${var.project_name}-${var.environment}-lambda-exec"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_permissions" {
  statement {
    sid    = "DynamoDBAccess"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:Query",
    ]
    resources = [
      aws_dynamodb_table.citizen_profiles.arn,
      "${aws_dynamodb_table.citizen_profiles.arn}/index/*",
      aws_dynamodb_table.consent_records.arn,
      aws_dynamodb_table.applications.arn,
      "${aws_dynamodb_table.applications.arn}/index/*",
      aws_dynamodb_table.audit_trail.arn,
    ]
  }

  statement {
    sid    = "S3ReadSchemes"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.scheme_rules.arn,
      "${aws_s3_bucket.scheme_rules.arn}/*",
    ]
  }

  statement {
    sid    = "CloudWatchLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    sid    = "BedrockInvoke"
    effect = "Allow"
    actions = [
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream",
    ]
    resources = [
      "arn:aws:bedrock:${var.aws_region}::foundation-model/amazon.titan-text-premier-v2:0",
      "arn:aws:bedrock:${var.aws_region}::foundation-model/anthropic.claude-3-haiku*",
    ]
  }

  statement {
    sid    = "TranscribeAccess"
    effect = "Allow"
    actions = [
      "transcribe:StartStreamTranscription",
      "transcribe:StartTranscriptionJob",
      "transcribe:GetTranscriptionJob",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "SNSPublish"
    effect = "Allow"
    actions = [
      "sns:Publish",
    ]
    resources = [aws_sns_topic.citizen_alerts.arn]
  }

}

resource "aws_iam_role_policy" "lambda_permissions" {
  name   = "${var.project_name}-${var.environment}-lambda-policy"
  role   = aws_iam_role.lambda_exec.id
  policy = data.aws_iam_policy_document.lambda_permissions.json
}

# --- Lambda Function ---

resource "aws_lambda_function" "eligibility_api" {
  function_name = "${var.project_name}-${var.environment}-eligibility"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "handlers/eligibilityApi.handler"
  runtime       = "nodejs20.x"
  memory_size   = 256
  timeout       = 30
  filename      = "${path.module}/../backend/function.zip"

  environment {
    variables = {
      SCHEME_RULES_BUCKET     = aws_s3_bucket.scheme_rules.id
      CITIZEN_PROFILES_TABLE  = aws_dynamodb_table.citizen_profiles.name
      CONSENT_RECORDS_TABLE   = aws_dynamodb_table.consent_records.name
      APPLICATIONS_TABLE      = aws_dynamodb_table.applications.name
      DYNAMO_AUDIT_TABLE      = aws_dynamodb_table.audit_trail.name
      DYNAMO_APP_TABLE        = aws_dynamodb_table.applications.name
      SNS_TOPIC_ARN           = aws_sns_topic.citizen_alerts.arn
      BEDROCK_MODEL_ID        = "amazon.titan-text-premier-v2:0"
      TRANSCRIBE_LANGUAGE     = "hi-IN"
      ENABLE_MOCK_AADHAAR     = "true"
      ENABLE_MOCK_DIGILOCKER  = "true"
      ENABLE_MOCK_UPI_BANK    = "true"
      MASK_AADHAAR_IN_LOGS    = "true"
    }
  }
}

# --- API Gateway ---

resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-${var.environment}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId"
  }
}

resource "aws_apigatewayv2_integration" "eligibility" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.eligibility_api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "eligibility" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /api/eligibility"
  target    = "integrations/${aws_apigatewayv2_integration.eligibility.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.eligibility_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

# --- CloudWatch ---

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.eligibility_api.function_name}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/apigateway/${var.project_name}-${var.environment}"
  retention_in_days = 14
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.project_name}-${var.environment}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Lambda function errors detected"

  dimensions = {
    FunctionName = aws_lambda_function.eligibility_api.function_name
  }
}

# --- Budget Alarm ---

resource "aws_budgets_budget" "monthly" {
  name         = "${var.project_name}-${var.environment}-monthly"
  budget_type  = "COST"
  limit_amount = var.budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
  }
}

# --- Amazon SNS (SMS Alerts) ---

resource "aws_sns_topic" "citizen_alerts" {
  name = "${var.project_name}-${var.environment}-citizen-alerts"
}

# --- DynamoDB: Applications Table ---

resource "aws_dynamodb_table" "applications" {
  name         = "HaqDaariApplications${title(var.environment)}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "applicationId"

  attribute {
    name = "applicationId"
    type = "S"
  }

  attribute {
    name = "citizenId"
    type = "S"
  }

  global_secondary_index {
    name            = "citizenId-index"
    hash_key        = "citizenId"
    projection_type = "ALL"
  }

  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true }
}

# --- DynamoDB: Audit Trail Table ---

resource "aws_dynamodb_table" "audit_trail" {
  name         = "HaqDaariAuditTrail${title(var.environment)}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "citizenId"
  range_key    = "eventId"

  attribute {
    name = "citizenId"
    type = "S"
  }

  attribute {
    name = "eventId"
    type = "S"
  }

  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true }
}

# --- S3: Frontend Static Hosting ---

resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-${var.environment}-frontend"
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document { suffix = "index.html" }
  error_document { key = "index.html" }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


