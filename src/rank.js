const path = require('path')
const childProcess = require('child_process')
const phantomjs = require('phantomjs-prebuilt')
const util = require(path.join(__dirname,'..','routes','util')) 
const csvWriter = require('csv-write-stream')
const fs = require('fs')


/*
data := array
*/
const writeToCSV = (data,filename) => {
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream(filename));
  for(var i in data){
    writer.write(data[i]);
  }
  writer.end();
}


const getRank =  (params) => new Promise((resolve,reject) =>{
  let childArgs = [
    path.join(__dirname, 'rank_ph.js'),
    params
  ]

  //console.log(phantomjs.path)
  //console.log(params[3])
  childProcess.execFile(phantomjs.path, childArgs, (err, stdout, stderr) => {
    if (err) {
      console.log('stderr:' + stderr)
      reject(stderr)
    }
    resolve(JSON.parse(stdout))
  })
})



// Main function
let time_string = util.getDateString(new Date())
let tasks = []
/*
for(let i=0;i<2;i++){
  tasks.push(["http://www.alexa.com/topsites/countries;"+i+"/TW"])
}
*/
tasks.push(["http://www.alexa.com/topsites/countries/TW"])
Promise.all(tasks.map(getRank)).then((data)=>{
  data = data[0]
  //writeToCSV(data, path.join(__dirname, time_string +".csv"))
  writeToCSV(data, path.join(__dirname, "/../data/",time_string +".csv"))
})




