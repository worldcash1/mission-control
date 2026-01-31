#!/bin/bash
# Add a todo to Mission Control via Convex
# Usage: ./add-todo.sh "Task title" "Optional description"

CONVEX_URL="https://reminiscent-avocet-969.convex.cloud"
TITLE="$1"
DESC="${2:-}"

if [ -z "$TITLE" ]; then
  echo "Usage: $0 \"Task title\" [\"Description\"]"
  exit 1
fi

# Build the JSON payload
if [ -z "$DESC" ]; then
  ARGS="{\"title\":\"$TITLE\"}"
else
  ARGS="{\"title\":\"$TITLE\",\"description\":\"$DESC\"}"
fi

curl -s "${CONVEX_URL}/api/mutation" \
  -H "Content-Type: application/json" \
  -d "{\"path\":\"todos:add\",\"args\":$ARGS}" | jq -r '.status'
