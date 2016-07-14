#!/bin/sh

export NODEJS="/usr/local/bin/node"
export PYTHON_EXE="/usr/bin/python3"
export PROJECT_PATH="/mnt/disks/data/ntuaha/Project/WebRank"
$NODEJS $PROJECT_PATH/routes/alexa_rank.js
$NODEJS $PROJECT_PATH/routes/run.js

#run selenium
Xvfb :99 &
export DISPLAY=:99
$PYTHON_EXE $PROJECT_PATH/routes/alexa_categories.py
