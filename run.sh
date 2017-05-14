#!/bin/sh

<<<<<<< HEAD
#/usr/local/bin/node /home/aha/Project/WebRank/routes/alexa_rank.js
#/usr/local/bin/node /home/aha/Project/WebRank/routes/run.js
/usr/local/bin/node /home/aha/Project/WebRank/src/rank.js
/usr/local/bin/node /home/aha/Project/WebRank/src/bank.js

=======
export NODEJS="/usr/local/bin/node"
#export PYTHON_EXE="/usr/bin/python3"
export PYTHON_EXE="/usr/local/bin/python3"
#export PROJECT_PATH="/mnt/disks/data/ntuaha/Project/WebRank"
export PROJECT_PATH="/home/aha/Project/WebRank/"
$NODEJS $PROJECT_PATH/routes/alexa_rank.js
$NODEJS $PROJECT_PATH/routes/run.js

#run selenium
#Xvfb :99 &
#export DISPLAY=:99

$PYTHON_EXE $PROJECT_PATH/routes/alexa_categories.py
>>>>>>> 437d574f23cd98f7c64321f055a732a4ddee80b4
