#!/bin/bash
docker stop MinesweeperServer;

docker rm MinesweeperServer;

docker rmi minesweeperserver:latest;

docker build --pull --rm -f "Dockerfile" -t minesweeperserver:latest ".";

docker run -d -p 8181:8181 -p 3000:3000 --name=MinesweeperServer minesweeperserver:latest;
