terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "HaqDaari"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

variable "aws_region" {
  default = "ap-south-1"
}

variable "environment" {
  default = "demo"
}

variable "project_name" {
  default = "haqdaari"
}

variable "budget_limit" {
  default = "50"
}
