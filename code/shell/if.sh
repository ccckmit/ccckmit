#!/bin/bash
echo "please input gender (male/female) :"
read gender
if test -n $gender
then
 echo gender is :$gender
else
 echo gender is null
fi
