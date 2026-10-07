terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

}

provider "aws" {
  # Configuration options
  region  = "us-east-1"
  profile = "process"
}

data "aws_caller_identity" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id

}
resource "aws_cognito_user_pool" "pool" {
  name = "jusswipe-user-pool"

  alias_attributes = ["email"]

  auto_verified_attributes = ["email"]

  username_configuration {

    case_sensitive = false

  }
  password_policy {

    minimum_length    = 6
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false

  }

  account_recovery_setting {

    recovery_mechanism {

      name     = "verified_email"
      priority = 1
    }
  }

  mfa_configuration = "OFF"
}
resource "aws_cognito_user_pool_client" "client" {
  name            = "jusswipe-user-pool-client"
  user_pool_id    = aws_cognito_user_pool.pool.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

