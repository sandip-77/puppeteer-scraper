// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const converter = require('json-2-csv');



const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Async function which scrapes the data
async function scrapeData(url) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".cards .card-body");
    // Stores data for all countries
    const Companies1 = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const Companie = {  name:'',Categoria:'', address: "" , CodiceIdentificativo :"", telephone:'', email:'', website:''};
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      Companie.name = $(el).children("h6").text();
      Companie.address = $(el).children("p:nth-child(2)").children('span:nth-child(2)').text();
      Companie.CodiceIdentificativo = $(el).children("p:nth-child(3)").children('span:nth-child(2)').text();
      Companie.Categoria = $(el).children("p:nth-child(4)").children('a').text();
      Companie.telephone = $(el).children("p:nth-child(5)").children('span:nth-child(2)').text();
      Companie.email = $(el).children("p:nth-child(6)").children('span:nth-child(2)').text();
      Companie.website = $(el).children("p:nth-child(7)").children('a').text();
      Companie.iso3 = $(el).children("span").text();
      // Populate Companies1 array with Companie data
      Companies1.push(Companie);
    });
    // Logs Companies1 array to the console
    console.dir(Companies1);
    const companies1 = JSON.parse(JSON.stringify(Companies1, null, 2)); 

    converter.json2csv(companies1, (err, csv) => {
      if (err) {
          throw err;
      }
  
      // print CSV string
      console.log(csv);
  const my= url.split('/')[url.split('/').length - 2]
      // write CSV to a file
      fs.writeFileSync(`${my}.csv`, csv);

      return csv;
      
  });
  } catch (err) {
    console.error(err);
  }
}

app.get('/', (req, res)=> {
    res.render('index')
    
})
// Invoke the above function

app.post('/', async(req, res) => {
  console.log('triggerd');
  console.log('req', req.body);
  const url= req.body.url;
  await scrapeData(url);
  const file = `${__dirname}/companies1.csv`;
  res.download(file); // Set disposition and send it.
  res.redirect('/')

})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
})