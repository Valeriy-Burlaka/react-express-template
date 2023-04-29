#!/usr/bin/env bash

# Test GET /messages endpoint

source ./utils.sh

response=$(curl -s -X GET http://localhost:3001/messages)
expected_response='[{"id":"f6lc0la6k1nbb","text":"Hi there!","author":"Unknown","timestamp":1682757551396},{"id":"f6lc0la6k3m5l","text":"Any news?","author":"Unknown","timestamp":1682790735895}]'

if [ "$response" == "$expected_response" ]; then
  print_test_result "GET /messages" "passed"
else
  print_test_result "GET /messages" "failed"
  echo "Expected response: $expected_response"
  echo "Actual response: $response"
fi
