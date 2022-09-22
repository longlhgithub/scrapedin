const openPage = require('../openPage')
const scrapSection = require('../scrapSection')
const { posts } = require('./companyScraperTemplate')
const template = require('./companyScraperTemplate')

const logger = require('../logger')(__filename)
module.exports = (browser, cookies, url, puppeteerAuthenticate = undefined) => {
  return {
    getPosts: async ({ untilPostId, pageSize }) => {
      const msg = `starting scraping url: ${url}`;
      logger.info(msg)
      console.log(msg)
      const posts = await openPage({
        browser,
        cookies,
        url,
        puppeteerAuthenticate,
        mobile: true,
        pageCallback: async (page) => {
          // scrolling to bottom to fetch more items.
          let foundStopAt = false
          let elementIndex = 1
          const posts = []
          while (true) {
            const sectionTemplate = {
              ...template.posts,
              selector: `${template.posts.selector}:nth-of-type(n+${elementIndex})`,
            }
            let result = await scrapSection(page, sectionTemplate)
            elementIndex += result.length
            if (!result.length) break
            for (const post of result) {
              if (post.id.indexOf(untilPostId) > -1) {
                foundStopAt = true
                break
              }
              posts.push({
                ...post,
                id: post.id.indexOf(':') ? post.id.split(':')[1] : p.id,
              })
              if (pageSize && posts.length >= pageSize) {
                foundStopAt = true
                break
              }
            }
            if (foundStopAt) break

            await page.$eval('.feeds li.feed-item:last-of-type', (e) => {
              e.scrollIntoView({
                block: 'end',
                inline: 'end',
              })
            })
            await new Promise((r) => setTimeout(r, 2000))
            await page.waitForSelector('.spinner.hidden')
          }

          logger.info(`finished scraping url: ${url}`)
          return posts
        },
      })
      return posts;
    },
  }
}
