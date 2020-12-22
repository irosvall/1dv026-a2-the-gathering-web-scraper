/**
 * The application module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import validator from 'validator'
import { WriteToConsole } from './write-to-console.js'
import { CalendarAvailabilityController } from './calendar-availability-controller.js'
import { LinkScraper } from './link-scraper.js'

/**
 * Encapsulates a Node application.
 *
 * @class
 */
export class Application {
  /**
   * Creates an instance of the Application class.
   *
   * @param {string} url - The url to be scraped.
   */
  constructor (url) {
    /**
     * The url to be scraped.
     *
     * @type {string}
     */
    this.url = url
  }

  /**
   * Get the url to be scraped.
   *
   * @returns {string} - The url.
   */
  get url () {
    return this._url
  }

  /**
   * Set the url to be scraped.
   *
   * @param {string} url - The url.
   *
   */
  set url (url) {
    if (typeof url === 'undefined') {
      throw new Error('No argument was sent')
    } else if (!validator.isURL(url)) {
      throw new Error('Argument sent is not a valid url')
    } else {
      this._url = url
    }
  }

  /**
   * Runs the application.
   */
  async run () {
    const links = await LinkScraper.scrapeWebsiteLinks(this._url)
    WriteToConsole.scrapingLinksSucceed()

    const availableDays = await CalendarAvailabilityController.checkAvailableDays(links[0])
    WriteToConsole.scrapingAvailableDaysSucceed()
  }
}
