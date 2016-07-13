/* output infomation */
const fs = require("fs");
const csvWriter = require('csv-write-stream');

function getDateString(d){
  var year = d.getFullYear();
  var month = d.getMonth()+1;
  month = (month<10)?'0'+month:month;
  var day = d.getDate();
  day = (day<10)?'0'+day:day;
  var hour = d.getHours();
  hour = (hour<10)?'0'+hour:hour;
  var min = d.getMinutes();
  min = (min<10)?'0'+min:min;
  var sec = d.getSeconds();
  sec = (sec<10)?'0'+sec:sec;
  //return year+month+day+hour+min+sec;
  return year+month+day;
}


function writeToCSV(data,filename){
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream(filename));
  for(var i in data){
    writer.write(data[i]);
  }
  writer.end();
}


module.exports = {
  "getDateString": getDateString,
  "writeToCSV": writeToCSV
};
