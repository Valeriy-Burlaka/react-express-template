#!/usr/bin/env bash

function red() {
  echo -e "\033[31m$1\033[0m"
}

function green() {
  echo -e "\033[32m$1\033[0m"
}

function print_test_result() {
  test_name=$1
  test_status=$2
  if [ "${test_status,,}" == "passed" ]; then
    echo -e "Test $test_name $(green "PASSED")"
  elif [ "${test_status,,}" == "failed" ]; then
    echo -e "Test $test_name $(red "FAILED")"
  fi
}

# print_test_result "GET /messages" "passed"
# print_test_result "GET /messages/updates" "failed"
