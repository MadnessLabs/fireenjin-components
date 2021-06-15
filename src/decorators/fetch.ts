export default async function sdkFetch<t = any, x = any>(
  endpoint: string,
  options: {
    debug?: boolean;
    disableFetch?: boolean;
    disableCache?: boolean;
    cacheKey?: string;
    id?: string | number;
    params?: t;
    data?: any;
  } = {}
): Promise<x> {
  return new Promise((resolve, reject) => {
    if (window && document?.body) {
      const onSuccess = function (event) {
        if (endpoint === event.detail?.endpoint && !event.detail?.cached) {
          resolve(event?.detail?.data ? event.detail.data : null);
          document.body.removeEventListener(
            "fireenjinSuccess",
            onSuccess,
            false
          );
        }
      };
      document.body.addEventListener("fireenjinSuccess", onSuccess, false);
      window.dispatchEvent(
        new CustomEvent("fireenjinFetch", {
          detail: {
            endpoint,
            ...options,
          },
        })
      );
    } else {
      reject("No window or document body found.");
    }
  });
}
