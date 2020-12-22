/**
 * The calendar-availability-scraper module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * Represents a scraper that checks the calendar availability.
 *
 * @class
 */
export class CalendarAvailabilityScraper {
  /**
   * Scrapes a website of its links.
   *
   * @param {string} url - The url to be scraped.
   * @returns {string[]} List containing 'ok' if the day is available.
   */
  static async scrapeIfAvailable (url) {
    try {
      const dom = await JSDOM.fromURL(url)

      const availableList = Array.from(dom.window.document.querySelectorAll('td'))
        .map(element => element.textContent.toLowerCase())

      return availableList
    } catch {
      throw new Error(`Couldn't scrape ${url} calendar`)
    }
  }
}
