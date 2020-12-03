#!/bin/sh

docker run -p 8888:8888 -it --log-opt mode=non-blocking --log-opt max-buffer-size=4m $1

