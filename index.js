//as this was a practice project and my first scraper I have not implemented a user interface , In case anyone wants to Contribute I would really appriciate it

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


async function scrapedList(page) {

    
    await page.goto('https://bangalore.craigslist.org/d/software-qa-dba-etc/search/sof');//insert/replace this link with your city's craigslist page link 
    
    
    const html = await page.content();
    const $=await cheerio.load(html);
    
    const listings=$('.result-info').map((index,element)=>{

    titleElement=$(element).find('.result-title');
    timeElement=$(element).find('.result-date');
    placeElement=$(element).find('.result-meta');

    const title =$(titleElement).text();
    const url =$(titleElement).attr("href");

    const date =new Date($(timeElement).attr("datetime"));

    const place =$(placeElement).find(".nearby").attr("title");

    return {title,url,date,place};

    }).get(); 

    return(listings);
   
}




async function scrapeJobDescriptions(listings,page){

    for(var i=0;i<listings.length; i++){

        await page.goto(listings[i].url);
        const html = await page.content();
        const $=await cheerio.load(html);
        await sleep(1000);
        console.log(listings[i].url);
        const desc = $("#postingbody").text();
        
        listings[i].desc=desc;
        console.log( listings[i].desc);

    }

}

function sleep(t) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, t)
    });
 }


async function main() {

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const listings = await scrapedList(page);
    const listingsWithJobDescription= await scrapeJobDescriptions(listings,page);
    console.log(listings);

}


main();