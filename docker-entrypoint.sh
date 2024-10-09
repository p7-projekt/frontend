#!/bin/bash
# Change ownership of the mounted directory to the local user
chown -R $(id -u):$(id -g) /home/ubuntu/frontend

# Execute the CMD
exec "$@"
