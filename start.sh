#!/bin/bash
docker compose -f devops/docker-compose.dev.yaml -p crazytrau-nestjs-steps-handler --env-file devops/.env.example up -d;