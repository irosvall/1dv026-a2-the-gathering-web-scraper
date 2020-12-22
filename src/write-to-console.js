/**
 * The write-to-console module.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

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
}
