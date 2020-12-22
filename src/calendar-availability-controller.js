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
   * @returns {string[]} List containing which day(s) are available.
   */
  static async checkAvailableDays (url) {
    const calendarList = await LinkScraper.scrapeWebsiteLinks(url)

    // Gets the first calendar to compare.
    const daysAvailable = await CalendarAvailabilityScraper.scrapeIfAvailable(calendarList[0])

    // Compare the other's calendars with the first calendar. If a day doesn't work then 'ok' is changed.
    for (let i = 1; i < calendarList.length; i++) {
      const tempDaysAvailable = await CalendarAvailabilityScraper.scrapeIfAvailable(calendarList[i])
      for (let j = 0; j < tempDaysAvailable.length; j++) {
        if (tempDaysAvailable[j] !== 'ok') {
          daysAvailable[j] = tempDaysAvailable[j]
        }
      }
    }
    return daysAvailable
  }
}
