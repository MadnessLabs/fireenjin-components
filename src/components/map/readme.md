# fireenjin-map



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                           | Type                                                                                        | Default     |
| --------- | --------- | ------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| `apiKey`  | `api-key` | The Google Maps API Key               | `string`                                                                                    | `undefined` |
| `markers` | --        | A list of markers to put onto the map | `{ position: { lat: number; lng: number; }; name: string; icon: string; payload?: any; }[]` | `[]`        |
| `optins`  | `optins`  | Google Maps options                   | `any`                                                                                       | `{}`        |
| `visible` | `visible` | Should the map be visible?            | `boolean`                                                                                   | `true`      |


## Events

| Event              | Description                         | Type                                                                                                                                                                 |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fireenjinTrigger` | When a marker on the map is clicked | `CustomEvent<{ trigger: string; payload: { marker: Marker; location: { position: { lat: number; lng: number; }; name: string; icon: string; payload?: any; }; }; }>` |


## Methods

### `addMarker(location: { position: { lat: number; lng: number; }; name: string; icon: string; payload?: any; }) => Promise<google.maps.Marker>`

Add a marker to the map

#### Returns

Type: `Promise<Marker>`



### `clearMarkers() => Promise<boolean>`

Clear the markers off of the map

#### Returns

Type: `Promise<boolean>`



### `setCenter(latLng: google.maps.LatLng | google.maps.LatLngLiteral) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `setMarkers(markers?: { position: { lat: number; lng: number; }; name: string; icon: string; payload?: any; }[]) => Promise<{ position: { lat: number; lng: number; }; name: string; icon: string; payload?: any; }[]>`

Set the list of map markers

#### Returns

Type: `Promise<{ position: { lat: number; lng: number; }; name: string; icon: string; payload?: any; }[]>`



### `setZoom(level: number) => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
