const puppeteer = require('puppeteer');

const now = new Date();

const seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
const minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();

const fileName = `Screen Shot ${now.getFullYear()}-${now.getMonth()}-${now.getDate()} at ${now.getHours()}.${minutes}.${seconds}`;
const homeDir = require('os').homedir();

const filePath = homeDir + '/' + fileName + '.png';

const argv = require('yargs/yargs')(process.argv.slice(2))
      .usage('Usage: $0 http://example.org/')
      .demandCommand(1)
      .number(['w', 'h'])
      .demandOption(['w', 'h'])
      .describe('w', 'Browser width')
      .describe('h', 'Browser height')
      .describe('cookie-name', 'Cookie name')
      .describe('cookie-value', 'Cookie value')
      .implies('cookie-name', 'cookie-value')
      .string(['cookie-name', 'cookie-value'])
      .alias('cn', 'cookie-name')
      .alias('cv', 'cookie-value')
      .argv;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: argv.w,
    height: argv.h,
    deviceScaleFactor: 1,
  });
  await page.goto(argv._[0]);

  if (argv['cookie-name']) {
    await page.setCookie({ name: argv['cookie-name'], value: argv['cookie-value']});
    await page.goto(argv._[0]);
  }

  await page.screenshot({ path: filePath });

  await browser.close();

  console.log(`Success! Saved at ${filePath}`);
})();