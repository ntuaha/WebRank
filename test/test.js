const util = require("../routes/util");

console.log(util.getDateString(new Date()));

/*
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
*/
const jsdom = require("node-jsdom");
const fs = require("fs");
const jquery = fs.readFileSync(__dirname+"/../routes/jquery.js", "utf-8");

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.alexa.com/siteinfo/esunbank.com.tw');
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
      }
    });
});;
//driver.findElement(By.name('q')).sendKeys('webdriver');
//driver.findElement(By.name('btnG')).click();
//driver.wait(until.titleIs('webdriver - Google Search'), 1000);