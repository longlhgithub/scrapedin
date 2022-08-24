const agents = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  // 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
  // "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0",
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
  // "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0",
  // "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
]
const mobileAgents = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
]

module.exports = async ({
  browser,
  cookies,
  url,
  puppeteerAuthenticate,
  mobile,
  pageCallback,
}) => {
  const result = await browser.execute(
    {
      cookies,
      url,
      puppeteerAuthenticate,
      mobile,
      pageCallback,
    },
    async (task) => {
      const { page, data } = task
      const { cookies, url, puppeteerAuthenticate, mobile, pageCallback } = data
      await page.setDefaultNavigationTimeout(0)
      if (cookies) {
        await page.setCookie(...cookies)
      }
      const ua = mobile ? mobileAgents : agents
      await page.setUserAgent(ua[Math.floor(Math.random() * ua.length)])
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      })
      if (mobile)
        await page.setViewport({
          width: 390,
          height: 844,
        })
      else
        await page.setViewport({
          width: 1920,
          height: 1080,
        })

      if (puppeteerAuthenticate) {
        await page.authenticate(puppeteerAuthenticate)
      }

      await page.goto(url, { waitUntil: 'networkidle2' })
      if (pageCallback) return await pageCallback(page)
    },
  )
  return result
}
