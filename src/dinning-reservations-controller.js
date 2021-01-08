/**
 * The dinning-reservations-controller module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import fetch from 'node-fetch'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * Represents a controller that checks for available dinning reservations.
 *
 * @class
 */
export class DinningReservationsController {
  /**
   * Creates an instance of the dinning reservations controller class.
   *
   * @param {string} url - The url to the dinning page.
   * @param {string} day - The day to check or available dinning reservations.
   */
  constructor (url, day) {
    /**
     * The url to the dinning page.
     *
     * @type {string}
     */
    this._url = url

    /**
     * The day to check or available dinning reservations.
     *
     * @type {string}
     */
    this._day = day

    /**
     * The day to check or available dinning reservations.
     *
     * @type {string}
     */
    this._cookie = ''
  }

  /**
   * Returns the possible dinning reservations on a weekend day(friday, saturday or sunday).
   *
   * @throws {Error} Will throw an error if the login couldn't be fetched.
   * @throws {Error} Will throw an error if the booking site couldn't be fetched.
   *
   * @returns {object[]} An array containing objects with available times for dinning reservations.
   */
  async getAvailableDinningTimes () {
    await this._getLoginCookie()

    const bookingSiteHtml = await this._getBookingSite()

    const dom = new JSDOM(bookingSiteHtml)

    // Creates an array of the available booking times.
    const availableTimes = Array.from(dom.window.document.querySelectorAll(`input[name="group1"][value^="${this._day.slice(0, 3)}"] ~ span`))
      .map(element => {
        return {
          day: `${this._day}`,
          // Parse the text content so that only the time is left.
          time: `${element.textContent.trim().split(' ')[0]}`
        }
      })
    return availableTimes
  }

  /**
   * Log in on the booking site and saves its cookie.
   *
   * @throws {Error} Will throw an error if the login couldn't be fetched.
   */
  async _getLoginCookie () {
    let res
    try {
      res = await fetch(`${this._url}login`, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: 'username=zeke&password=coys&submit=login',
        method: 'POST',
        redirect: 'manual'
      })
    } catch {
      throw new Error('Couldn\'t fetch the login')
    }
    this._extractCookie(res)
  }

  /**
   * Gets the plain text from the booking site.
   *
   * @throws {Error} Will throw an error if the booking site couldn't be fetched.
   *
   * @returns {string} The content as plain text.
   */
  async _getBookingSite () {
    let res
    try {
      res = await fetch(`${this._url}login/booking`, {
        headers: {
          cookie: `${this._cookie}`
        }
      })
    } catch {
      throw new Error('Couldn\'t fetch the booking site')
    }
    return res.text()
  }

  /**
   * Parses a cookie. Leaving out the text after the first ';'.
   *
   * @param {Response} res - The response from doing a log in.
   */
  _extractCookie (res) {
    this._cookie = res.headers.raw()['set-cookie'][0]
      .split(';')[0]
  }
}
