#!/bin/sh

# Start Fastify in the foreground
node dist/index.js &

# Capture the PID of the Fastify process
FASTIFY_PID=$!

# Wait for a few seconds to ensure the server is up
sleep 5

# Run the type generation command
npm run generate:db:types || echo "Type generation failed, but continuing..."

# Wait for the Fastify process to exit
wait $FASTIFY_PID