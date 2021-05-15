/**
 * Function for running a function until it completes successfully 
 * with an optional delay between runs that gets progressively longer.
 * 
 * Special Thanks to @MyBuilderTech
 * @see https://tech.mybuilder.com/handling-retries-and-back-off-attempts-with-javascript-promises/
 */

const pause = (duration) => new Promise((res) => setTimeout(res, duration));

export default async function backoff(
  retries: number,
  fn: () => any,
  delay = 500
) {
  return new Promise(async (resolve, reject) => {
      if (!fn || typeof fn !== "function") reject("Callback function is required!");
      try {
        resolve(fn());
      } catch(err) {
        if (retries > 1) {
            await pause(delay);
            backoff(retries - 1, fn, delay * 2)
        } else {
            reject(err);
        }
      }
 });
}
