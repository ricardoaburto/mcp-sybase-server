#!/bin/bash

# This script builds the Docker image for the Sybase server.

IMAGE_NAME="executedatabase/sybase-server"
IMAGE_TAG="latest"

echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"

docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

echo "Build complete."
echo "To run the container, use a command like:"
echo "docker run -i --rm ${IMAGE_NAME}:${IMAGE_TAG} '{"host":"your_host","port":your_port,"database":"your_db","user":"your_user","password":"your_pass"}'"
