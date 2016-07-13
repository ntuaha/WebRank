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
      /*"html":page_source*/
      "src": [jquery],
      "done": function(error,window){
          var $ = window.$;                   
          // 抓取分類 
          data.categories  = $("#category_link_table tr[class=' ']").text().trim().split("\n").map(function(d){ return d.trim()}).join(' | ');
          //remove webpage file
          fs.unlinkSync(in_file);          
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
function extract(records,i,time_string,f){
  /* 根據連結抓出網頁檔案放入本機，並回傳本機路徑 */
  return extractData(records[i].href,time_string,records[i].title)
  .then(function(filepath){
    /* 根據連結抓出關鍵資訊,回傳重點結果 */
    return extractInfo(filepath,records[i]);
  }).then(function(data){
    console.log("total",records.length);
    console.log("current",i);    
    var d = records[i];
    console.log("data",d);
    fs.writeSync(f,[d.count,d.title,d.href,data.categories,d.description].join(",")+"\n");
    i = i+1;    
    console.log("next",i);
    //決定結束點
    if(i>=records.length){
      fs.closeSync(f);
    }else{      
      extract(records,i,time_string,f);
    }
  });
}

function run(records,time_string){
  var f = fs.openSync(__dirname+"/../data/alexa_categories_"+time_string+".csv","w+");
  fs.writeSync(f,"count,title,href,categories,description\n");
  extract(records,0,time_string,f);
}

/*
function run(records,time_string){
  var tasks = records.map(function(d){
    return extract(d,time_string);
  });

  Promise.all(tasks).then(function(data){
    data = data.sort(function(a,b){
      return a.count - b.count;
    });        
    util.writeToCSV(data, __dirname+"/../data/alexa_categories_"+time_string+".csv");
  });
}
*/

var time_string = util.getDateString(new Date());

/* 讀取 csv */
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




