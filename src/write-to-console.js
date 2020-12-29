/**
 * The write-to-console module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import colors from 'colors'
import UpperCaseFirst from 'upper-case-first'
const { upperCaseFirst } = UpperCaseFirst

/**
 * Represents a console logger.
 *
 * @class
 */
export class WriteToConsole {
  /**
   * Console log that links has been scraped successfully.
   */
  static scrapingLinksSucceed () {
    console.log('Scraping links...OK')
  }

  /**
   * Console log that available days has been scraped successfully.
   */
  static scrapingAvailableDaysSucceed () {
    console.log('Scraping available days...OK')
  }

  /**
   * Console log that showtimes has been scraped successfully.
   */
  static scrapingShowtimesSucceed () {
    console.log('Scraping showtimes...OK')
  }

  /**
   * Console log that possible reservations has been scraped successfully.
   */
  static scrapingReservationsSucceed () {
    console.log('Scraping possible reservations...OK')
  }

  /**
   * Prints out a title to show that underneath there will come suggestions.
   */
  static suggestionsStart () {
    console.log('\nSuggestions\n===========')
  }

  /**
   * Console log suggestions for day, movie and time to book a table.
   *
   * @param {string} day - The day for the occasion.
   * @param {string} movieTitle - The title of the movie.
   * @param {string} showTime - The time the movie starts
   * @param {string} dinnerTime - The time a table can be booked between.
   */
  static suggestion (day, movieTitle, showTime, dinnerTime) {
    // Parse the dinner time hours.
    const dinnerTimeArray = dinnerTime.split('-')
    const dinnerTimeMap = dinnerTimeArray.map(time => time + ':00')
    dinnerTime = dinnerTimeMap.join('-')

    console.log(`* On ${upperCaseFirst(day)}, ${colors.red(`"${movieTitle}"`)} begins at ${showTime}, and there is a free table to book between ${dinnerTime}.`)
  }
}
