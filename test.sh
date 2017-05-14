#!/bin/sh

export NODEJS="/usr/local/bin/node"
export PYTHON_EXE="/usr/bin/python3"
export PROJECT_PATH="/home/ntuaha/Project/WebRank"


#run selenium
Xvfb :99 &
export DISPLAY=:99
$PYTHON_EXE $PROJECT_PATH/routes/alexa_categories.py 
