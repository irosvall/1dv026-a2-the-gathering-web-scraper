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

    /**
     * The day to check available movies.
     *
     * @type {object[]} An array containing objects with available showtimes.
     */
    this._showtimes = []
  }

  /**
   * Returns the available showtimes on a weekend day(friday, saturday or sunday).
   *
   * @returns {object[]} An array containing objects with available showtimes.
   */
  async checkShowtimes () {
    if (this._day === 'friday') {
      for (let i = 1; i < 4; i++) {
        let res = await fetch(`${this._url}/check?day=05&movie=0${i}`)
        res = await res.json()
        for (let j = 0; j < res.length; j++) {
          if (res[j].status === 1) {
            this._showtimes.push({
              day: `${this._day}`,
              time: `${res[j].time}`,
              title: `${await this._scrapeMovieTitle(`0${i}`)}`
            })
          }
        }
      }
    } else if (this._day === 'saturday') {
      for (let i = 1; i < 4; i++) {
        let res = await fetch(`${this._url}/check?day=06&movie=0${i}`)
        res = await res.json()
        for (let j = 0; i < res.length; i++) {
          if ([j].status === 1) {
            this._showtimes.push({
              day: `${this._day}`,
              time: `${[j].time}`,
              title: `${await this._scrapeMovieTitle(`0${i}`)}`
            })
          }
        }
      }
    } else if (this._day === 'sunday') {
      for (let i = 1; i < 4; i++) {
        let res = await fetch(`${this._url}/check?day=07&movie=0${i}`)
        res = await res.json()
        for (let j = 0; i < res.length; i++) {
          if ([j].status === 1) {
            this._showtimes.push({
              day: `${this._day}`,
              time: `${[j].time}`,
              title: `${await this._scrapeMovieTitle(`0${i}`)}`
            })
          }
        }
      }
    }
    return this._showtimes
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
}
