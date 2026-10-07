resource "aws_dynamodb_table" "scores" {
  name         = "jusswipe-score-dynamodb"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "userId"
  range_key = "recordId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "recordId"
    type = "S"
  }

  attribute {
    name = "leaderboard"
    type = "S"
  }

  attribute {
    name = "score"
    type = "N"
  }

  global_secondary_index {
    name            = "overall-score"
    hash_key        = "leaderboard"
    range_key       = "score"
    projection_type = "ALL"
  }
}


