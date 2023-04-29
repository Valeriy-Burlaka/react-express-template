#!/usr/bin/env bash

source ./utils.sh

# Test data
text="New helpful comment"
author="Val Bu"
timestamp=$(python -c 'import time; print(int(time.time() * 1000))')

# Send POST request and save response
response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"text\": \"$text\", \"author\": \"$author\", \"timestamp\": \"$timestamp\"}" http://localhost:3001/messages)

# Parse and compare the response
response_text=$(echo "$response" | jq -r '.text')
response_author=$(echo "$response" | jq -r '.author')
response_timestamp=$(echo "$response" | jq -r '.timestamp')
response_id=$(echo "$response" | jq -r '.id')
id_length=13

# echo "Response id: $response_id"
# echo "Response text: $response_text"
# echo "Response author: $response_author"
# echo "Response timestamp: $response_timestamp"

if [[ "$response_text" == "$text" && "$response_author" == "$author" && "$response_timestamp" == "$timestamp" && ${#response_id} -eq $id_length ]]; then
  print_test_result "POST /messages" "passed"
else
  print_test_result "POST /messages" "failed"
  echo "Expected:"
  echo "  id: length $id_length"
  echo "  text: $text"
  echo "  author: $author"
  echo "  timestamp: $timestamp"
  echo "Actual:"
  echo "  id: $response_id (length ${#response_id})"
  echo "  text: $response_text"
  echo "  author: $response_author"
  echo "  timestamp: $response_timestamp"
fi
