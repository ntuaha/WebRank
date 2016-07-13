const util = require("../routes/util");

console.log(util.getDateString(new Date()));


var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
 
var childArgs = [
  path.join(__dirname, '/../routes/alexa.js'),
  'http://www.alexa.com/siteinfo/esunbank.com.tw,/Users/bicc/Documents/aha/WebRank/routes/../rawdata/中國信託_20160712.html'
]
 
childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
    console.log(stderr);
    console.log(stdout);
})