#!/bin/bash
echo "please input your gender (male/female) :"
read gender
case $gender in
male)
  echo your are man
;;
female)
  echo your are woman
  ;;
*)
  echo "sorry , error!"
  ;;
esac