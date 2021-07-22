 ___  ___  ________  ___       ________          ________  _______   ___      ___ _______   ___       ________  ________  _______   ________     
|\  \|\  \|\   __  \|\  \     |\   __  \        |\   ___ \|\  ___ \ |\  \    /  /|\  ___ \ |\  \     |\   __  \|\   __  \|\  ___ \ |\   __  \    
\ \  \\\  \ \  \|\  \ \  \    \ \  \|\  \       \ \  \_|\ \ \   __/|\ \  \  /  / | \   __/|\ \  \    \ \  \|\  \ \  \|\  \ \   __/|\ \  \|\  \   
 \ \   __  \ \  \\\  \ \  \    \ \   __  \       \ \  \ \\ \ \  \_|/_\ \  \/  / / \ \  \_|/_\ \  \    \ \  \\\  \ \   ____\ \  \_|/_\ \   _  _\  
  \ \  \ \  \ \  \\\  \ \  \____\ \  \ \  \       \ \  \_\\ \ \  \_|\ \ \    / /   \ \  \_|\ \ \  \____\ \  \\\  \ \  \___|\ \  \_|\ \ \  \\  \| 
   \ \__\ \__\ \_______\ \_______\ \__\ \__\       \ \_______\ \_______\ \__/ /     \ \_______\ \_______\ \_______\ \__\    \ \_______\ \__\\ _\ 
    \|__|\|__|\|_______|\|_______|\|__|\|__|        \|_______|\|_______|\|__|/       \|_______|\|_______|\|_______|\|__|     \|_______|\|__|\|__|
                                                                                                                                                 


//As this was a practice project (and my first scraper) I have not felt the need to implemented a user interface rather I have focused on the functionality of the scraper. In case anyone wants to Contribute I would really appriciate it .

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

var data=fs.readFileSync('scrapedData.json');



async function scrapedList(page) {

    
    await page.goto('https://bangalore.craigslist.org/d/software-qa-dba-etc/search/sof');//insert or replace this link with your city's craigslist page link 
    
    
    const html = await page.content();
    const $=await cheerio.load(html);
    
    const listings=$('.result-info').map((index,element)=>{

        //Using the chrome dev tools find out which element you need to extract data from 
        
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
       
        const desc = $("#postingbody").text();//
        
        listings[i].desc=desc;
        var data=JSON.stringify(listings[i]);
         
        fs.appendFile('scrapedData.json',(data+",\n\n\n"),function(err){
                if(err){
                    console.log(err);
                }
            });
        console.log( listings[i]);
    }

}

function sleep(t) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, t)
    });
 }//DO NOT REMOVE THE sleep function ELSE your IP might get banned from cragslist for multiple requests in certain time period . 


async function main() {

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const listings = await scrapedList(page);
    const listingsWithJobDescription= await scrapeJobDescriptions(listings,page);
    console.log(listings);

}


main();
