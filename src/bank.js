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


const getBank =  (params) => new Promise((resolve,reject) =>{
  let childArgs = [
    path.join(__dirname, 'bank_ph.js'),
    params
  ]

  //console.log(phantomjs.path)
  console.log(params[3])
  childProcess.execFile(phantomjs.path, childArgs, (err, stdout, stderr) => {
    if (err) {
      console.log('stderr:' + stderr)
      reject(stderr)
    }
    data = JSON.parse(stdout)
    resolve(data)
  })
})



// Main function



let time_string = util.getDateString(new Date())
let tasks = []
tasks.push(['http://www.alexa.com/siteinfo/esunbank.com.tw', time_string, 'esun', '玉山銀行'])
tasks.push(['http://www.alexa.com/siteinfo/ctbcbank.com', time_string, 'ctbc', '中國信託'])
tasks.push(['http://www.alexa.com/siteinfo/citibank.com.tw', time_string, 'Citibank', '花旗銀行'])
tasks.push(['http://www.alexa.com/siteinfo/sinopac.com', time_string, 'sinopac', '永豐銀行'])
tasks.push(['http://www.alexa.com/siteinfo/taishinbank.com.tw', time_string, 'taishinbank', '台新銀行'])
tasks.push(['http://www.alexa.com/siteinfo/mybank.com.tw', time_string, 'cathaybk', '國泰世華'])
tasks.push(['http://www.alexa.com/siteinfo/hncb.com.tw', time_string, 'hncb', '華南銀行'])
tasks.push(['http://www.alexa.com/siteinfo/fubon.com', time_string, 'fubon', '富邦銀行'])
tasks.push(['http://www.alexa.com/siteinfo/post.gov.tw', time_string, 'post', '郵局'])
tasks.push(['http://www.alexa.com/siteinfo/bot.com.tw', time_string, 'taiwanbank', '臺灣銀行'])


Promise.all(tasks.map(getBank)).then((data)=>{
  data = data.sort((a, b) => (a.tw_rank - b.tw_rank))
  writeToCSV(data, path.join(__dirname, "/../data/","alexa_detail_"+ time_string +".csv"))
})




