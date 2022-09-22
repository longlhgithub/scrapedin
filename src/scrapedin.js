const puppeteer = require('puppeteer')
const {Cluster} = require('puppeteer-cluster');
const login = require('./login')
const profile = require('./profile/profile')
const company = require('./company/company')
const { COMPANY_TAGS } = require('./constants')
const logger = require('./logger')(__filename)

const maxUseCount = 10;
let useCount = 0;
let clusterInstance = null;

const createCluster = async () => {
  if (clusterInstance && (useCount < maxUseCount)) {     
      logger.info(`scrapedin: reuse cluster instance, count: ${useCount}, max: ${maxUseCount}`);
      useCount++;
      return clusterInstance;
  }
  logger.info('scrapedin: create new cluster instance');
  if (clusterInstance) {
      try {          
        logger.info('scrapedin: clean up cluster instance');
          await clusterInstance.idle();
          await clusterInstance.close();
      } finally {
          clusterInstance = null;
      }
  }
  const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 5,
      retryLimit: 3,
      retryDelay: 1000,
      workerCreationDelay: 1000,
      timeout: 15*60*1000, // 15 minutes
      puppeteerOptions: {ignoreHTTPSErrors: true, headless: true, args: [
          '--no-sandbox', // meh but better resource comsuption
          '--disable-setuid-sandbox', // same,
      ]},
      puppeteer,
  });
  clusterInstance = cluster;
  // reset usecount for new cluster
  useCount = 0;
  return clusterInstance;
};

module.exports = async ({ cookies, email, password, isHeadless, hasToLog, hasToGetContactInfo, puppeteerArgs, puppeteerAuthenticate, puppeteerCluster } = { isHeadless: true, hasToLog: false }) => {
  if (!hasToLog) {
    logger.stopLogging()
  }
  logger.info('initializing')

  const browser = puppeteerCluster || await createCluster();

  if (cookies) {
    logger.info('using cookies, login will be bypassed')
  } else if (email && password) {
    logger.info('email and password was provided, we\'re going to login...')
      await login(browser, email, password, logger)
  } else {
    logger.warn('email/password and cookies wasn\'t provided, only public data will be collected')
  }

  return (url, waitMs) => COMPANY_TAGS.some(x=> url.includes(`/${x}/`)) ? company(browser, cookies, url, waitMs, hasToGetContactInfo, puppeteerAuthenticate) : profile(browser, cookies, url, waitMs, hasToGetContactInfo, puppeteerAuthenticate)
}
