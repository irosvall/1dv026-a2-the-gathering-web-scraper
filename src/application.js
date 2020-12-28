/**
 * The application module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import validator from 'validator'
import { WriteToConsole } from './write-to-console.js'
import { LinkScraper } from './link-scraper.js'
import { CalendarAvailabilityController } from './calendar-availability-controller.js'
import { ShowtimesController } from './showtimes-controller.js'
import { DinningReservationsController } from './dinning-reservations-controller.js'

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

    /**
     * An array of links to the calender, cinema and restaurant.
     *
     * @type {Array}
     */
    this._links = undefined

    /**
     * An array of available days(s) on everyone's calendars.
     *
     * @type {Array}
     */
    this._availableDays = undefined

    /**
     * An array of available showtimes.
     *
     * @type {Array}
     */
    this._availableShowtimes = undefined

    /**
     * An array of available dinning times.
     *
     * @type {Array}
     */
    this._availableDinningTimes = undefined
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
    await this._scrapeLinks()
    await this._scrapeAvailableDays()
    await this._scrapeShowtimes()
    await this._scrapeDinningReservations()
    console.log(this._availableShowtimes)
    console.log(this._availableDinningTimes)
  }

  /**
   * Scrape links to calender, cinema and restaurant.
   */
  async _scrapeLinks () {
    this._links = await LinkScraper.scrapeWebsiteLinks(this._url)
    WriteToConsole.scrapingLinksSucceed()
  }

  /**
   * Scrape available day(s) on everyone's calendars.
   */
  async _scrapeAvailableDays () {
    this._availableDays = await CalendarAvailabilityController.getAvailableDays(this._links[0])
    WriteToConsole.scrapingAvailableDaysSucceed()

    if (this._availableDays.length === 0) {
      throw new Error('The calendars shares no available day.')
    }
  }

  /**
   * Scrape available showtimes.
   */
  async _scrapeShowtimes () {
    const showtimesPromise = []
    for (const day of this._availableDays) {
      const showtimesController = new ShowtimesController(this._links[1], day)
      showtimesPromise.push(showtimesController.getAvailableShowtimes())
    }
    const availableShowtimes = await Promise.all(showtimesPromise)
    this._availableShowtimes = availableShowtimes.flat()
    WriteToConsole.scrapingShowtimesSucceed()
  }

  /**
   * Scrape possible dinning reservations.
   */
  async _scrapeDinningReservations () {
    const dinningTimesPromise = []
    for (const day of this._availableDays) {
      const dinningReservationsController = new DinningReservationsController(this._links[2], day)
      dinningTimesPromise.push(dinningReservationsController.getAvailableDinningTimes())
    }
    const availableDinningTimes = await Promise.all(dinningTimesPromise)
    this._availableDinningTimes = availableDinningTimes.flat()
    WriteToConsole.scrapingReservationsSucceed()
  }
}
