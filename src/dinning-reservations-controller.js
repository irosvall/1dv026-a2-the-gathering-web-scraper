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
   * Returns the available dinning reservations on a weekend day(friday, saturday or sunday).
   *
   * @returns {object[]} An array containing objects with available dinning reservations.
   */
  async checkDinningReservations () {
    const dinningReservations = []

    const logInRes = await fetch(`${this._url}login`, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: 'username=zeke&password=coys&submit=login',
      method: 'POST',
      redirect: 'manual'
    })
    this._extractCookie(logInRes)

    const res = await fetch(`${this._url}login/booking`, {
      headers: {
        cookie: `${this._cookie}`
      }
    })
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
