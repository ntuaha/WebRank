var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
var system = require('system');
var fs = require('fs');
var system = require('system');

page.onConsoleMessage = function(msg) {
  console.log(JSON.stringify(msg));
}

var data = system.args[1].split(',')
page.open(data[0], function(status) {
  if(status === "success") {
    page.injectJs('../routes/jquery.js')
    var data2 = page.evaluate(function(company) {
        var data = {}
        data.company = company
        data.global_rank = +$('.globleRank strong:eq(2)').text().replace(/[\n ,]/g, '')
        data.tw_rank = +$('.countryRank strong:eq(2)').text().replace(/[\n ]/g, '')
        data.Bound_Rate = $("h4.metrics-title:contains('Bounce Rate')").parent().find('.metrics-data').text().replace(/[ \n]/g, '')
        data.DPV = $("h4.metrics-title:contains('Daily Pageviews per Visitor')").parent().find('.metrics-data').text().replace(/[ \n]/g, '')
        data.DTS = $("h4.metrics-title:contains('Daily Time on Site')").parent().find('.metrics-data').text().replace(/[ \n]/g, '')
        data.Search_Visits = $("h4.metrics-title:contains('Search Visits')").parent().find('.metrics-data').text().replace(/[ \n]/g, '')
        data.Total_Sites_Linking_Number = +$('h5.font-1').next().text()

        var Top_Keywords_From_SE = $('.topkeywordellipsis').map(function () {
            var jthis = $(this)
            return {
              'title': jthis.attr('title'),
              'count': +jthis.parent().attr('data-count'),
              'percent': jthis.next().text()
            }
          })

        var Linkin_Site = $('#linksin_table tbody tr').map(function () {
            var jthis = $(this)
            return {
              'count': +jthis.attr('data-count'),
              'host': jthis.find('a:eq(0)').text(),
              'link': jthis.find('a:eq(1)').attr('href')
            }
          })
        for (var j = 0; j < 5; j++) {
            data['Top_Keywords_From_SE_' + (j + 1)] = Top_Keywords_From_SE[j].count + ' || ' + Top_Keywords_From_SE[j].title + ' || ' + Top_Keywords_From_SE[j].percent
          }

        for (var i = 0; i < 5; i++) {
            data['Linkin_Site_' + (i + 1)] = Linkin_Site[i].count + ' || ' + Linkin_Site[i].host + ' || ' + Linkin_Site[i].link
          }

        data.load_velocity_rank = $('#loadspeed-panel-content span').text()
        data.load_velocity_desc = $('#loadspeed-panel-content p').text()
        return data;        
    },data[3]);
    console.log(JSON.stringify(data2))
    phantom.exit();   
  }else{
    phantom.exit(1);
  }
  
});


