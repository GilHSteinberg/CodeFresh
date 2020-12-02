#!/bin/sh

docker run -p 7000:7000 -it --log-opt mode=non-blocking --log-opt max-buffer-size=4m $1
