# Craigslist-JS-Scraper
Simple Craigslist Scraper using puppeteer and cheerio

Scrapes all the Job listings for a given Location/link and stores them in a JSON file.

## Steps to View Project :

- DOWNLOAD the .zip file or clone the rep.
- cd to the folder where the where the sttarting files exist .
- Install the dependencies from your package.json file OR Run the following command

              $ npm install
              
- After the installation is complete run the following command .

              $ node index.js

the scraped data is already present in the 'scrapedData.json' file . BEFORE '$ node index.js' copy the stored data to some other place (for futher use) delete the entire content of 'scrapedData.json' and then run '$ node index.js' or else newly scraped data might get appended to the previously present data .
Refer to the comments in the source code for more info . 
