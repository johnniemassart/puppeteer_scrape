import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

const go = async (pagesToCheck) => {
  // basic setup
  const browser = await puppeteer.launch({ headless: true, slowMo: 0 });
  const page = await browser.newPage();
  await page.goto("https://quotes.toscrape.com/");

  // click log in button
  const catalog_btn = await page.waitForSelector(".col-md-4 p a");
  await catalog_btn.click();

  // type username
  await page.waitForSelector("#username");
  await page.type("#username", "johnnie");

  // type password
  await page.waitForSelector("#password");
  await page.type("#password", "thisisjohnnie");

  // submit
  await page.keyboard.press("Enter");

  // iterate through page
  await page.waitForNavigation();
  let arr = [];
  let i = 0;
  while (i < pagesToCheck) {
    const quotes = await page.$$(".quote");
    for (const quote of quotes) {
      const text = await page.evaluate(
        (element) => element.querySelector(".text").innerText,
        quote
      );
      const author = await page.evaluate(
        (element) => element.querySelector(".author").innerText,
        quote
      );
      arr.push({ author, text });
    }
    await Promise.all([page.click(".next a"), page.waitForNavigation()]);
    i += 1;
  }

  await browser.close();
  return arr;
};

const pagesToCheck = 2;

console.log(await go(pagesToCheck));
