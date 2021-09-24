/**
 * Get the value from an object using a dot notation string.
 *
 * @param obj The object you are searching through
 * @param path The dot noation path to the value
 * @returns The value of the path in the object
 */
export default function pathToValue(obj: any, path: string) {
  return path.split(".").reduce((o, i) => o[i], obj);
}
