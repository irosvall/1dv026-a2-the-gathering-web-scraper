/**
 * The showtimes-controller module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * Represents a showtimes controller.
 *
 * @class
 */
export class ShowtimesController {
  /**
   * Creates an instance of the showtimes controller class.
   *
   * @param {string} url - The url to the cinema page.
   * @param {string} day - The day to check available movies.
   */
  constructor (url, day) {
    /**
     * The url to be cinema page.
     *
     * @type {string}
     */
    this._url = url

    /**
     * The day to check available movies.
     *
     * @type {string}
     */
    this._day = day
  }

  /**
   * Returns the available showtimes on a weekend day(friday, saturday or sunday).
   *
   * @returns {object[]} An array containing objects with available showtimes.
   */
  async checkShowtimes () {
    const showtimes = []
    const dayId = this._createDayId()

    for (let i = 1; i < 4; i++) {
      let res = await fetch(`${this._url}/check?day=${dayId}&movie=0${i}`)
      res = await res.json()
      for (let j = 0; j < res.length; j++) {
        // Checks if there is any available seats, if so, push it to available showtimes.
        if (res[j].status === 1) {
          const movieTitle = await this._scrapeMovieTitle(`0${i}`)
          showtimes.push({
            day: `${this._day}`,
            time: `${res[j].time}`,
            title: `${movieTitle}`
          })
        }
      }
    }

    return showtimes
  }

  /**
   * Scrape the cinema page for a movie's title.
   *
   * @param {string} titleId - The id of the movie.
   * @returns {string} The title of the movie.
   */
  async _scrapeMovieTitle (titleId) {
    try {
      const dom = await JSDOM.fromURL(this._url)

      const title = dom.window.document.querySelector(`#movie option[value="${titleId}"]`).textContent

      return title
    } catch {
      throw new Error('Failed scraping the movie name')
    }
  }

  /**
   * Creates a id for a weekend day.
   *
   * @returns {string} The day id.
   */
  _createDayId () {
    let dayId = ''
    if (this._day === 'friday') {
      dayId = '05'
    } else if (this._day === 'saturday') {
      dayId = '06'
    } else if (this._day === 'sunday') {
      dayId = '07'
    } else {
      throw new Error('Not a valid day')
    }
    return dayId
  }
}
