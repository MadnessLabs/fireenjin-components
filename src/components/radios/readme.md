# fireenjin-radios

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                                 | Default     |
| --------------- | ---------------- | ----------- | ------------------------------------ | ----------- |
| `label`         | `label`          |             | `string`                             | `undefined` |
| `labelPosition` | `label-position` |             | `"fixed" \| "floating" \| "stacked"` | `undefined` |
| `lines`         | `lines`          |             | `"full" \| "inset" \| "none"`        | `"none"`    |
| `name`          | `name`           |             | `string`                             | `undefined` |
| `options`       | `options`        |             | `any`                                | `undefined` |
| `required`      | `required`       |             | `any`                                | `undefined` |
| `selected`      | `selected`       |             | `number`                             | `0`         |
| `value`         | `value`          |             | `any`                                | `undefined` |


## Events

| Event       | Description | Type               |
| ----------- | ----------- | ------------------ |
| `ionChange` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- ion-item
- ion-label
- ion-icon

### Graph
```mermaid
graph TD;
  fireenjin-radios --> ion-item
  fireenjin-radios --> ion-label
  fireenjin-radios --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  style fireenjin-radios fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
