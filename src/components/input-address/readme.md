# fireenjin-input-address

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                              | Type                                 | Default     |
| --------------- | ----------------- | ---------------------------------------- | ------------------------------------ | ----------- |
| `googleMapsKey` | `google-maps-key` | The Google Maps API Key                  | `string`                             | `undefined` |
| `label`         | `label`           | The label of the input field             | `string`                             | `undefined` |
| `labelPosition` | `label-position`  |                                          | `"fixed" \| "floating" \| "stacked"` | `undefined` |
| `lines`         | `lines`           |                                          | `"full" \| "inset" \| "none"`        | `undefined` |
| `name`          | `name`            | The name attribute of the input          | `string`                             | `undefined` |
| `placeholder`   | `placeholder`     | The placeholder text for the input field | `string`                             | `undefined` |
| `required`      | `required`        | Whether the address input is required    | `boolean`                            | `undefined` |
| `value`         | `value`           | The value of the input field             | `any`                                | `{}`        |


## Events

| Event                       | Description | Type               |
| --------------------------- | ----------- | ------------------ |
| `fireenjinAddressMode`      |             | `CustomEvent<any>` |
| `fireenjinUpdateAutoHeight` |             | `CustomEvent<any>` |
| `ionInput`                  |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- ion-item
- ion-label
- ion-input
- ion-grid
- ion-row
- ion-col
- [fireenjin-input-state](../input-state)
- ion-button
- ion-icon

### Graph
```mermaid
graph TD;
  fireenjin-input-address --> ion-item
  fireenjin-input-address --> ion-label
  fireenjin-input-address --> ion-input
  fireenjin-input-address --> ion-grid
  fireenjin-input-address --> ion-row
  fireenjin-input-address --> ion-col
  fireenjin-input-address --> fireenjin-input-state
  fireenjin-input-address --> ion-button
  fireenjin-input-address --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  fireenjin-input-state --> ion-select
  fireenjin-input-state --> ion-select-option
  ion-button --> ion-ripple-effect
  style fireenjin-input-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
