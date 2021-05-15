/**
 * Injects a script tag into the page for a desired JS file
 * and is async if you need to wait for it to load before continuing
 * @param src The path to the JavaScript file
 * @returns void when the script is loaded
 */
export default async function injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.addEventListener("load", resolve);
    script.addEventListener("error", () => reject("Error loading script."));
    script.addEventListener("abort", () => reject("Script loading aborted."));
    document.head.appendChild(script);
  });
}
