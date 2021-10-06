# fireenjin-input-json

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                                 | Default     |
| --------------- | ---------------- | ----------- | ------------------------------------ | ----------- |
| `label`         | `label`          |             | `string`                             | `undefined` |
| `labelPosition` | `label-position` |             | `"fixed" \| "floating" \| "stacked"` | `undefined` |
| `lines`         | `lines`          |             | `"full" \| "inset" \| "none"`        | `undefined` |
| `name`          | `name`           |             | `string`                             | `"json"`    |
| `value`         | `value`          |             | `any`                                | `{}`        |


## Dependencies

### Depends on

- ion-item
- ion-label
- [fireenjin-json-editor](../json-editor)

### Graph
```mermaid
graph TD;
  fireenjin-input-json --> ion-item
  fireenjin-input-json --> ion-label
  fireenjin-input-json --> fireenjin-json-editor
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  style fireenjin-input-json fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
