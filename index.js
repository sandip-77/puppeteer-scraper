const puppeteer = require("puppeteer");
const Standings = require("./scrapers/standings");
const Email = require("./utils/email");

/**
 * Run Standings
 */
(async () => {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      headless: true
    });

    page = await browser.newPage();

    const standings = await new Standings(browser, page).main();

    await Email.send(
      `<ul style="list-style:none;">
        ${standings.map(
          ([team, points], i) => `<li>${i + 1}: ${team} ${points}</li>`
        )}
      </ul>`.replace(/\,/g, "")
    );
  } catch (error) {
    await Email.send(error.stack, true);
  }

  await browser.close();
})();
