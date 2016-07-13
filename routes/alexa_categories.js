const path = require('path');
/* jquery parse */
const jsdom = require("node-jsdom");
const fs = require("fs");

/* jquery source code */
const jquery = fs.readFileSync(__dirname+"/jquery.js", "utf-8");
const csv = require("fast-csv");
 
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    Browser = webdriver.Browser,
    until = webdriver.until;


const driver = new webdriver.Builder()
    /*.forBrowser('chrome')*/
    .forBrowser(Browser.PHANTOM_JS)
    .build();

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

function extractData(href,time_string,company_name){
  return new Promise(function(resolve){
    driver.get(href);
    driver.getPageSource()
    .then(function(source){
      jsdom.env({
          "html": source,
          "src": [jquery],
          "done": function(error,window){
              var $ = window.$;                   
              /* 抓取分類 */
              var categories  = $("#category_link_table tr[class=' ']").text().trim().split("\n").map(function(d){ return d.trim()}).join(' | ');          
              console.log(categories);
              resolve(categories);
          }
        });
    });
  });
}

/* 執行程式 */
function extract(records,i,time_string,f){
  /* 根據連結抓出網頁檔案放入本機，並回傳本機路徑 */
  return extractData(records[i].href,time_string,records[i].title)
  .then(function(data){
    console.log("total",records.length);
    console.log("current",i);    
    var d = records[i];
    console.log("data",d);
    fs.writeSync(f,[d.count,d.title,d.href,'"'+data+'"','"'+d.description+'"'].join(",")+"\n");
    i = i+1;    
    console.log("next",i);
    //決定結束點
    if(i>=records.length){
      fs.closeSync(f);
      driver.quit();
    }else{      
      extract(records,i,time_string,f);
      global.gc();

    }
  });
}

function run(records,time_string){
  var f = fs.openSync(__dirname+"/../data/alexa_categories_"+time_string+".csv","w+");
  fs.writeSync(f,"count,title,href,categories,description\n");
  extract(records,0,time_string,f);
}


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




