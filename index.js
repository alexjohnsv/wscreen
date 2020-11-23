const puppeteer = require('puppeteer');

const now = new Date();

const seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

const fileName = `Screen Shot ${now.getFullYear()}-${now.getMonth()}-${now.getDate()} at ${now.getHours()}.${now.getMinutes()}.${seconds}`;
const homeDir = require('os').homedir();

const filePath = homeDir + '/' + fileName + '.png';

const argv = require('yargs/yargs')(process.argv.slice(2))
      .usage('Usage: $0 http://example.org/')
      .demandCommand(1)
      .number(['w', 'h'])
      .demandOption(['w', 'h'])
      .describe('w', 'Browser width')
      .describe('h', 'Browser height')
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

  await page.screenshot({ path: filePath });

  await browser.close();

  console.log(`Success! Saved at ${filePath}`);
})();