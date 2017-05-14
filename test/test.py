from selenium import webdriver
import os
import datetime
import csv

browser = webdriver.Chrome()

href = "http://www.alexa.com/siteinfo/google.com.tw"
dirname = os.path.dirname(os.path.abspath(__file__));
print(dirname)
time_string = datetime.datetime.now().strftime("%Y%m%d")
with open(dirname+"/../data/alexa_categories_%s.csv"%time_string,"w+") as f:    
  with open(dirname+"/../data/%s.csv"%time_string, "r") as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    i = 0
    for row in reader:
      if i==0:
        f.write("count,title,href,categories,description\n")
      else:
        (count,title,href,description) = row;
        print(href)
        browser.get(href)
        categories = "|".join(map(lambda x:x.text,browser.find_elements_by_css_selector("#category_link_table tr[class=' ']")))
        f.write(",".join([count,title,href,'"'+categories+'"','"'+description+'"'])+"\n")
        f.flush()
      i = i + 1
      print("%d"%(i))