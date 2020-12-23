/**
 * The calendar-availability-controller module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import { LinkScraper } from './link-scraper.js'
import { CalendarAvailabilityScraper } from './calendar-availability-scraper.js'

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
   * @returns {string[]} List containing which weekend day(s) are available.
   */
  static async checkAvailableDays (url) {
    const calendarList = await LinkScraper.scrapeWebsiteLinks(url)

    // Gets the first calendar to compare.
    const daysOk = await CalendarAvailabilityScraper.scrapeIfAvailable(calendarList[0])

    // Compare the other's calendars with the first calendar. If a day doesn't work then 'ok' is changed.
    for (let i = 1; i < calendarList.length; i++) {
      const tempdaysOk = await CalendarAvailabilityScraper.scrapeIfAvailable(calendarList[i])
      for (let j = 0; j < tempdaysOk.length; j++) {
        if (tempdaysOk[j] !== 'ok') {
          daysOk[j] = tempdaysOk[j]
        }
      }
    }

    // Translates the ok days to weekend days. The available days gets pushed into list.
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
