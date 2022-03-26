const writeFileSync = require("fs").writeFileSync;

/**
 * @class Standings
 */
module.exports = class Standings {
  /**
   * @constructor
   */
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;

    this.standings = [];
    this.url = "https://aziende.tuttosuitalia.com/lazio/roma/affile/";
  }

  /**
   * @method main
   */
  async main() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
    await this.page.waitFor(2000);

    // Decided to add more data for fun. Notice how I also refactored to cut down on some boilerplate
    // by adding a reusable function inside of the map statement.
    this.standings = await this.page.evaluate(() =>
      Array.from(document.getElementsByClassName("card-body")).map(team => {
        const getData = child =>
          team
            .querySelector(`h6`).textContent
            // .querySelector(`p:nth-child(${child}) > span:nth-child(1)`).textContent
            // .getAttribute("data-value");

        return [getData(1), getData(2), getData(3), getData(4)];
      })
    );

    this.writeToJson();
    return this.standings;
  }

  /**
   * @method writeToJson
   */
  writeToJson() {
    writeFileSync("./data/standings.json", JSON.stringify(this.standings));
  }
};
