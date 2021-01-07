import "@ionic/core";
import { GraphQLClient } from "graphql-request";
import localforage from "localforage";
import isEqual from "lodash/fp/isEqual";
import { getSdk, Sdk } from "@madnesslabs/fireenjin-backend/dist/sdk";

async function setComponentProps(event, data) {
  let newData = data ? data : {};
  if (event.detail.dataPropsMap) {
    const dataKeys = Object.keys(event.detail.dataPropsMap);
    for (const key of dataKeys) {
      newData[event.detail.dataPropsMap[key]] = data[key];
    }
  }

  return newData;
}

export default () => {
  if (window && !(window as any).FireEnjin) {
    let client: GraphQLClient, sdk: Sdk;
    (window as any).FireEnjin = {
      init: async (
        options: {
          host?: string;
          token?: string;
          onError?: (error) => void;
          onSuccess?: (data) => void;
          headers?: any;
          functionsHost?: string;
          uploadUrl?: string;
        } = {}
      ) => {
        client = new GraphQLClient(options.host, {
          headers: {
            Authorization: options.token ? `Bearer ${options.token}` : "",
            ...(options.headers ? options.headers : {})
          }
        });
        sdk = getSdk(client);

        window.addEventListener("fireenjinUpload", async (event: any) => {
          if (!event.detail?.data?.encodedContent) return false;
          try {
            const response = await fetch(
              options.uploadUrl ? options.uploadUrl : `${options.functionsHost
              }/upload`,
              {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  id: event.detail.data?.id,
                  path: event.detail.data?.path,
                  fileName: event.detail.data?.fileName,
                  file: event.detail.data?.encodedContent,
                  type: event.detail.data?.type
                })
              }
            );
            const data = await response.json();
            event.target.value = data.url;

            document.body.dispatchEvent(
              new CustomEvent("fireenjinSuccess", {
                detail: {
                  event: event.detail.event,
                  data,
                  target: event.target,
                  name: event.detail.name,
                  endpoint: event.detail.endpoint
                }
              })
            );
          } catch (err) {
            if (options.onError && typeof options.onError === "function") {
              options.onError(err);
            }
            document.body.dispatchEvent(
              new CustomEvent("fireenjinError", {
                detail: {
                  event: event?.detail?.event,
                  target: event?.target,
                  error: err,
                  name: event?.detail?.name,
                  endpoint: event?.detail?.endpoint
                }
              })
            );
          }
        });

        window.addEventListener("fireenjinSubmit", async (event: any) => {
          console.log(event);
          if (
            !event ||
            !event.detail ||
            !event.detail.endpoint ||
            !sdk[event.detail.endpoint] ||
            event.detail.disableSubmit
          )
            return false;

          try {
            const data = await sdk[event.detail.endpoint]({
              id: event.detail.id,
              data: event.detail.data
            });

            if (options.onSuccess && typeof options.onSuccess === "function") {
              options.onSuccess(data);
            }
            document.body.dispatchEvent(
              new CustomEvent("fireenjinSuccess", {
                detail: {
                  event: event.detail?.event,
                  data,
                  name: event.detail.name,
                  endpoint: event.detail.endpoint
                }
              })
            );
          } catch (err) {
            if (options.onError && typeof options.onError === "function") {
              options.onError(err);
            }
            document.body.dispatchEvent(
              new CustomEvent("fireenjinError", {
                detail: {
                  event: event?.detail?.event,
                  error: err,
                  name: event?.detail?.name,
                  endpoint: event?.detail?.endpoint
                }
              })
            );
          }

          if (
            event?.target?.setLoading &&
            typeof event?.target?.setLoading === "function"
          ) {
            event.target.setLoading(false);
          }
        });
        window.addEventListener("fireenjinFetch", async (event: any) => {
          if (
            !event ||
            !event.detail ||
            !event.detail.endpoint ||
            !sdk[event.detail.endpoint] ||
            event.detail.disableFetch
          )
            return false;

          let cachedData;
          const localKey = event.detail.cacheKey
            ? event.detail.cacheKey
            : `${event.detail.endpoint}_${
                event.detail.id
                  ? `${event.detail.id}:`
                  : event.detail.params
                  ? btoa(JSON.stringify(Object.values(event.detail.params)))
                  : ""
              }${btoa(JSON.stringify(event.detail.data))}`;

          if (!event.detail.disableCache) {
            try {
              cachedData = await localforage.getItem(localKey);
              if (cachedData) {
                const data = await setComponentProps(event, cachedData);
                document.body.dispatchEvent(
                  new CustomEvent("fireenjinSuccess", {
                    detail: {
                      event: event.detail.event,
                      target: event.target,
                      cached: true,
                      data,
                      name: event.detail.name,
                      endpoint: event.detail.endpoint
                    }
                  })
                );
                if (
                  event?.target?.setLoading &&
                  typeof event?.target?.setLoading === "function"
                ) {
                  event.target.setLoading(false);
                }
              }
            } catch (err) {
              console.log(err);
            }
          }

          try {
            const response = event?.detail?.query
              ? await client.request(event.detail.query, event.detail.params)
              : await sdk[event.detail.endpoint](event.detail.params);

            const data = await setComponentProps(event, response);

            if (options.onSuccess && typeof options.onSuccess === "function") {
              options.onSuccess(response);
            }
            if (!cachedData || (cachedData && !isEqual(cachedData, response))) {
              document.body.dispatchEvent(
                new CustomEvent("fireenjinSuccess", {
                  detail: {
                    event: event.detail?.event,
                    target: event.target,
                    cached: false,
                    data,
                    name: event.detail.name,
                    endpoint: event.detail.endpoint
                  }
                })
              );
              try {
                await localforage.setItem(localKey, response);
              } catch (err) {
                console.log(err);
              }
            }
          } catch (err) {
            if (options.onError && typeof options.onError === "function") {
              options.onError(err);
            }
            document.body.dispatchEvent(
              new CustomEvent("fireenjinError", {
                detail: {
                  event: event?.detail?.event,
                  target: event?.target,
                  error: err,
                  name: event?.detail?.name,
                  endpoint: event?.detail?.endpoint
                }
              })
            );
          }

          if (
            event?.target?.setLoading &&
            typeof event?.target?.setLoading === "function"
          ) {
            event.target.setLoading(false);
          }
        });

        return {
          client,
          sdk
        };
      },
      setHeader(key: string, value: string) {
        if (client) {
          client.setHeader(key, value);
          sdk = getSdk(client);
        }

        return true;
      }
    };
  }
};
