/**
 * The link-scraper module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * Represents a link scraper.
 *
 * @class
 */
export class LinkScraper {
  /**
   * Scrapes a website of its links.
   *
   * @param {string} url - The url to be scraped.
   * @throws {Error} Will throw an error if an url couldn't get scraped for links.
   *
   * @returns {string[]} An array containing the scraped links.
   */
  static async scrapeWebsiteLinks (url) {
    try {
      const dom = await JSDOM.fromURL(url)

      const scrapedLinks = Array.from(dom.window.document.querySelectorAll('a'))
        .map(element => element.href)

      return scrapedLinks
    } catch {
      throw new Error(`Failed scraping ${url}`)
    }
  }
}
