#!/bin/sh

docker run -p 9000:9000 -it --log-opt mode=non-blocking --log-opt max-buffer-size=4m $1


