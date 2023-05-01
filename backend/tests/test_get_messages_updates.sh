#!/usr/bin/env bash

source ./utils.sh

# Test /messages/updates SSE endpoint
temp_file="updates_test.tmp"

# Listen to the /messages/updates endpoint using curl and save the output to a temporary file
curl -s -N -H "Accept:text/event-stream" http://localhost:3001/messages/updates > "$temp_file" &
curl_pid=$!

# Give the curl process some time to establish a connection
sleep 1

# Send a new message using POST /messages endpoint
# Test data
text="Hello!"
author="JayHemp"
timestamp=$(python -c 'import time; print(int(time.time() * 1000))')
response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"text\": \"$text\", \"author\": \"$author\", \"timestamp\": \"$timestamp\"}" http://localhost:3001/messages)

response_id=$(echo "$response" | jq -r '.id')

# Give the server some time to broadcast the new message to connected clients
sleep 1

# Kill the curl process that listens for updates
kill $curl_pid

# # Why are you not working!?!?!?!
# IFS=$'\n' read -r actual_id actual_text actual_author actual_timestamp <<< "$(head -1 $temp_file | sed 's/data: //g' | jq -r '.id, .text, .author, .timestamp')"
# # Parses only the first variable :cry: Workswhen running in terminal, but not in the script
# echo $actual_id
# echo $actual_text
# echo $actual_author
# echo $actual_timestamp

sse_id=$(head -1 $temp_file | sed 's/data: //g' | jq -r '.id')
sse_text=$(head -1 $temp_file | sed 's/data: //g' | jq -r '.text')
sse_author=$(head -1 $temp_file | sed 's/data: //g' | jq -r '.author')
sse_timestamp=$(head -1 $temp_file | sed 's/data: //g' | jq -r '.timestamp')

rm "$temp_file"

if [[ "$response_id" == "$sse_id" && "$text" == "$sse_text" && "$author" == "$sse_author" && "$timestamp" == "$sse_timestamp" ]]; then
  print_test_result "SSE update from /messages/updates endpoint" "passed"
else
  print_test_result "SSE update from /messages/updates endpoint" "failed"
  echo "Expected:"
  echo "  id: $response_id"
  echo "  text: $text"
  echo "  author: $author"
  echo "  timestamp: $timestamp"
  echo "Actual:"
  echo "  id: $sse_id"
  echo "  text: $sse_text"
  echo "  author: $sse_author"
  echo "  timestamp: $sse_timestamp"
fi
