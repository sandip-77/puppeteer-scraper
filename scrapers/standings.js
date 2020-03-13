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
    this.url = "https://www.dotabuff.com/procircuit/team-standings";
  }

  /**
   * @method main
   */
  async main() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });

    this.standings = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll("tbody > tr")).map(team => [
        team.querySelector("td:nth-child(2)").getAttribute("data-value"),
        team.querySelector("td:nth-child(3)").getAttribute("data-value")
      ])
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
