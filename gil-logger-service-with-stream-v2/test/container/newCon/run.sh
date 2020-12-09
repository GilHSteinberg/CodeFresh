#!/bin/sh

docker run --label mylabel="con1" -p 8888:8888 -it --log-opt mode=non-blocking --log-opt max-buffer-size=4m $1

