const path = require('path');

/* phantomjs */
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');

/* jquery parse */
const jsdom = require("node-jsdom");
const fs = require("fs");

/* jquery source code */
const jquery = fs.readFileSync(__dirname+"/jquery.js", "utf-8");
const exec_js_path = path.join(__dirname, '/alexa.js');
const csv = require("fast-csv");
 

/*
util.getDateString
*/
const util = require('./util');


/*
in_file: 提供已經下載下來的網頁位置
company: 提供company名字
本函數主要將網頁中分類收取出來，將資料輸出成json格式

輸出為 {"categories":分類1|分類2|分類3...}
*/

function extractInfo(in_file,data){
  return new Promise(function(resolve){
    jsdom.env({
      "file": in_file,
      "src": [jquery],
      "done": function(error,window){
          var $ = window.$;                   
          /* 抓取分類 */
          data.categories  = $("#category_link_table tr[class=' ']").text().trim().split("\n").map(function(d){ return d.trim()}).join(' | ');          
          resolve(data);
      }
    });
  });
}


/* 根據資料時間, 進行*/
function extractData(href,time_string,company_name){
  return new Promise(function(resolve){
    var file_filepath = __dirname+"/../rawdata/"+company_name+"_"+time_string+".html";
    var childArgs = [
      exec_js_path,
      [href,file_filepath].join(",")
    ];
    /* 用phantomjs 將網頁資料讀取下來 */
    childProcess.execFile(phantomjs.path, childArgs, function(err, stdout, stderr) {
      if(err){
        console.log("stderr:" + stderr);
      }
      console.log("RUN",company_name);
      resolve(file_filepath);
    });
  });
}

/* 執行程式 */
//function extract(href,time_string,company_name,rank,append_info){
function extract(d,time_string){
  /* 根據連結抓出網頁檔案放入本機，並回傳本機路徑 */
  return extractData(d.href,time_string,d.title)
  .then(function(filepath){
    /* 根據連結抓出關鍵資訊,回傳重點結果 */
    return extractInfo(filepath,d);
  });
}


/*
tasks.push(run("http://www.alexa.com/siteinfo/esunbank.com.tw",time_string,"esun","玉山銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/ctbcbank.com",time_string,"ctbc","中國信託"));
tasks.push(run("http://www.alexa.com/siteinfo/citibank.com.tw",time_string,"Citibank","花旗銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/sinopac.com",time_string,"sinopac","永豐銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/taishinbank.com.tw",time_string,"taishinbank","台新銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/firstbank.com.tw",time_string,"firstbank","第一銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/mybank.com.tw",time_string,"cathaybk","國泰世華"));
tasks.push(run("http://www.alexa.com/siteinfo/hncb.com.tw",time_string,"hncb","華南銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/fubon.com",time_string,"fubon","富邦銀行"));
tasks.push(run("http://www.alexa.com/siteinfo/post.gov.tw",time_string,"post","郵局"));
tasks.push(run("http://www.alexa.com/siteinfo/bot.com.tw",time_string,"taiwanbank","臺灣銀行"));
*/

function run(records,time_string){
  var tasks = records.map(function(d){
    //return extract(d.href,time_string,d.company_name,d.rank);
    //count,title,href,description
    //return extract(d.href,time_string,d.title,d.count,d);
    return extract(d,time_string);
  });

  Promise.all(tasks).then(function(data){
    data = data.sort(function(a,b){
      return a.count - b.count;
    });
        
    util.writeToCSV(data, __dirname+"/../data/alexa_categories_"+time_string+".csv");
  });
}
var time_string = util.getDateString(new Date());


/*
var task = [];
task.push({"company_name":"玉山銀行","rank":1,"href":"http://www.alexa.com/siteinfo/esunbank.com.tw"});
task.push({"company_name":"中國信託","rank":2,"href":"http://www.alexa.com/siteinfo/ctbcbank.com"});
task.push({"company_name":"google","rank":3,"href":"http://www.alexa.com/siteinfo/www.google.com.tw"});
*/

var records = [];
csv
 .fromPath(__dirname+"/../data/"+time_string+".csv",{"headers":true})
 .on("data", function(data){
     records.push(data);
 })
 .on("end", function(){
     console.log("done");
     run(records,time_string);
 });




