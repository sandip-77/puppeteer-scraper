const writeFileSync = require("fs").writeFileSync;

/**
 * @function Scraper
 */
const Scraper = async (browser, page) => {
  const url = "https://www.dotabuff.com/procircuit/team-standings";

  await page.goto(url);
  await page.waitFor(2500);

  const standings = await page.evaluate(() =>
    Array.from(document.querySelectorAll("tbody > tr")).map(team => [
      team.querySelector("td:nth-child(2)").getAttribute("data-value"),
      team.querySelector("td:nth-child(3)").getAttribute("data-value")
    ])
  );

  writeToJson(standings);
};

/**
 * @function writeToJson
 */
const writeToJson = standings => {
  writeFileSync("./data/standings.json", JSON.stringify(standings));
};

module.exports = Scraper;
