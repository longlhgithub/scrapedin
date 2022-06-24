const openPage = require('../openPage')
const scrapSection = require('../scrapSection')
const template = require('./companyScraperTemplate')
const companyPost = require('./companyPost');
const { COMPANY_TAGS } = require('@longlh/scrapedin/src/constants');
const mobileLink = 'https://www.linkedin.com/mwlite';

const logger = require('../logger')(__filename)

module.exports = async (browser, cookies, url, waitTimeToScrapMs = 500, puppeteerAuthenticate = undefined) => {
  logger.info(`starting scraping url: ${url}`);

  let company = {};
  const companyTag = COMPANY_TAGS.find(x =>url.includes(`/${x}/`));
  const urlSegments = url.split('/');

  const companyCode = urlSegments[urlSegments.indexOf(companyTag)+ 1];

  // company.about = (await scrapSection(page, template.about))[0];
  company.profile = async () => {
    let page;
    if(url.includes('legacySchoolId=')){
        page = await openPage({ browser, cookies, url, puppeteerAuthenticate });

        const aboutSelector = 'a[href$="/about/"]';

        company.url = page.url();

        await page.$eval(aboutSelector, async about => await about.click());
        await page.waitForNavigation();
    } else{
        company.url = url;
        url = url + '/about';
        page = await openPage({ browser, cookies, url, puppeteerAuthenticate });
    }
    const result = (await scrapSection(page, template.profile))[0];
    await page.close();
    return result;
  };
  company.post = companyPost(browser,cookies,`${mobileLink}/company/${companyCode}`);

  logger.info(`finished scraping url: ${url}`);

  return company

}
