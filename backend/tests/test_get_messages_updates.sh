#!/usr/bin/env bash

# Test /messages/updates SSE endpoint
temp_file="updates_test.tmp"

# Listen to the /messages/updates endpoint using curl and save the output to a temporary file
curl -s -N -H "Accept:text/event-stream" http://localhost:3001/messages/updates > "$temp_file" &
curl_pid=$!

# Give the curl process some time to establish a connection
sleep 1

# Send a new message using POST /messages endpoint
new_message='{"text":"Hello!","author":"Jay Hemp","timestamp":1624364100000}'
curl -s -X POST -H "Content-Type: application/json" -d "$new_message" http://localhost:3001/messages

# Give the server some time to broadcast the new message to connected clients
sleep 1

# Kill the curl process that listens for updates
kill $curl_pid

# Check the output of the /updates endpoint
received_updates=$(cat "$temp_file")
expected_update="data: $(echo "$new_message" | tr -d '\n')"
rm "$temp_file"

if [[ "$received_updates" == *"$expected_update"* ]]; then
  echo "Test POST /messages and /updates: PASSED"
else
  echo "Test POST /messages and /updates: FAILED"
  echo "Expected update: $expected_update"
  echo "Actual updates: $received_updates"
fi