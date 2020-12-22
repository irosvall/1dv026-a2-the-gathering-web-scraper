/**
 * The starting point of the application.
 *
 * @author Ida Rosvall <ir222gn@student.lnu.se
 * @version 1.0.0
 */

import { Application } from './application.js'

/**
 * The main function of the application.
 */
const main = async () => {
  try {
    // Parse the command-line (skip the first two arguments).
    const [,, url] = process.argv

    // Begin to run the application.
    const application = new Application(url)
    await application.run()
  } catch (error) {
    console.error(error.message)
  }
}

main()
