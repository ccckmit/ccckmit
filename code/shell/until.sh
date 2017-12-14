#!/bin/bash
echo input a line:
read line
until [ $line = "quit" ]
do 
  echo "your input is :"$line
  echo input a line:
  read line
done
