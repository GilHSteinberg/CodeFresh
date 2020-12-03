#!/bin/sh


output1=$(docker build -t con1 ./container/.)
id1=`echo ${output1##* }`
output2=$(docker build -t con2 ./container/newCon/.)
id2=`echo ${output2##* }`
output3=$(docker build -t con3 ./container/newCon/newCon2/. )
id3=`echo ${output3##* }`

gnome-terminal --tab -e "./container/run.sh $id1" --tab -e "./container/newCon/run.sh $id2" --tab -e "./container/newCon/newCon2/run.sh $id3"





