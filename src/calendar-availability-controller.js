/**
 * The calendar-availability-controller module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import { LinkScraper } from './link-scraper.js'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * Represents a calendar availability controller.
 *
 * @class
 */
export class CalendarAvailabilityController {
  /**
   * Checks which day(s) all calendars are available.
   *
   * @param {string} url - A url that contains links to people's calendars.
   * @throws {Error} Will throw an error if an url couldn't get scraped for links.
   * @throws {Error} Will throw an error if a calendar couldn't get scraped.
   *
   * @returns {string[]} List containing which weekend day(s) are available.
   */
  async getAvailableDays (url) {
    // Get links to everyone's calendars.
    const calendarList = await LinkScraper.scrapeWebsiteLinks(url)

    // Get the first calendar to compare.
    const daysOk = await this._scrapeIfAvailable(calendarList[0])

    // Compare the other's calendars with the first calendar. If a day doesn't work then 'ok' is changed.
    for (let i = 1; i < calendarList.length; i++) {
      const tempdaysOk = await this._scrapeIfAvailable(calendarList[i])
      for (let j = 0; j < tempdaysOk.length; j++) {
        if (tempdaysOk[j] !== 'ok') {
          daysOk[j] = tempdaysOk[j]
        }
      }
    }

    return this._parseAvailableDays(daysOk)
  }

  /**
   * Scrapes a website of its links.
   *
   * @param {string} url - The url to be scraped.
   * @throws {Error} Will throw an error if a calendar couldn't get scraped.
   *
   * @returns {string[]} List containing 'ok' if the day is available.
   */
  async _scrapeIfAvailable (url) {
    try {
      const dom = await JSDOM.fromURL(url)

      const availableList = Array.from(dom.window.document.querySelectorAll('td'))
        .map(element => element.textContent.toLowerCase())

      return availableList
    } catch {
      throw new Error(`Couldn't scrape ${url} calendar`)
    }
  }

  /**
   * Translates an array of 'ok' to weekend days.
   * The days that are 'ok' gets pushed into the available days list.
   *
   * @param {string[]} daysOk - An array containing 'ok' if the day is free.
   *
   * @returns {string[]} An array of available weekend days.
   */
  _parseAvailableDays (daysOk) {
    const daysAvailable = []
    for (let i = 0; i < daysOk.length; i++) {
      if (daysOk[i] === 'ok') {
        if (i === 0) {
          daysAvailable.push('friday')
        } else if (i === 1) {
          daysAvailable.push('saturday')
        } else if (i === 2) {
          daysAvailable.push('sunday')
        }
      }
    }
    return daysAvailable
  }
}
