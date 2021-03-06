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
   * @throws {Error} Will throw an error if no argument is specified.
   * @throws {Error} Will throw an error if argument isn't a valid url.
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
   * Runs the application. Prints out suggestions for day, movie and time to book a table.
   *
   * @throws {Error} Will throw an error if an url couldn't get scraped for links.
   * @throws {Error} Will throw an error if a calendar couldn't get scraped.
   * @throws {Error} Will throw an error if the calendars shares no available day.
   * @throws {Error} Will throw an error if the day isn't friday, saturday or sunday.
   * @throws {Error} Will throw an error if a movie couldn't be fetched.
   * @throws {Error} Will throw an error if the movie's name couldn't be scraped.
   * @throws {Error} Will throw an error if the login couldn't be fetched.
   * @throws {Error} Will throw an error if the booking site couldn't be fetched.
   */
  async run () {
    await this._scrapeLinks()
    await this._scrapeAvailableDays()
    await this._scrapeShowtimes()
    await this._scrapeDinningReservations()
    this._printSuggestions()
  }

  /**
   * Scrape links to calender, cinema and restaurant.
   *
   * @throws {Error} Will throw an error if an url couldn't get scraped for links.
   */
  async _scrapeLinks () {
    this._links = await LinkScraper.scrapeWebsiteLinks(this._url)
    WriteToConsole.scrapingLinksSucceed()
  }

  /**
   * Scrape available day(s) on everyone's calendars.
   *
   * @throws {Error} Will throw an error if a calendar couldn't get scraped.
   * @throws {Error} Will throw an error if the calendars shares no available day.
   */
  async _scrapeAvailableDays () {
    const calendarAvailabilityController = new CalendarAvailabilityController()
    this._availableDays = await calendarAvailabilityController.getAvailableDays(this._links[0])
    WriteToConsole.scrapingAvailableDaysSucceed()

    if (this._availableDays.length === 0) {
      throw new Error('The calendars shares no available day.')
    }
  }

  /**
   * Scrape available showtimes.
   *
   * @throws {Error} Will throw an error if the day isn't friday, saturday or sunday.
   * @throws {Error} Will throw an error if a movie couldn't be fetched.
   * @throws {Error} Will throw an error if the movie's name couldn't be scraped.
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
   *
   * @throws {Error} Will throw an error if the login couldn't be fetched.
   * @throws {Error} Will throw an error if the booking site couldn't be fetched.
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

  /**
   * Calculate and console log out suggestions for day, movie and time to book a table.
   */
  _printSuggestions () {
    WriteToConsole.suggestionsStart()

    for (const showtime of this._availableShowtimes) {
      for (const dinnerTime of this._availableDinningTimes) {
        if (showtime.day === dinnerTime.day) {
          // Only parse the starting hours to numbers for comparison.
          const showtimeHour = parseInt(showtime.time.split(':')[0])
          const dinnerTimeHour = parseInt(dinnerTime.time.split('-')[0])
          if (showtimeHour + 2 === dinnerTimeHour) {
            WriteToConsole.suggestion(showtime.day, showtime.title, showtime.time, dinnerTime.time)
          }
        }
      }
    }
  }
}
