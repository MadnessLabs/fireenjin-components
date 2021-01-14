# my-component



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type     | Default     |
| ---------- | ---------- | ----------- | -------- | ----------- |
| `first`    | `first`    |             | `string` | `undefined` |
| `last`     | `last`     |             | `string` | `undefined` |
| `middle`   | `middle`   |             | `string` | `undefined` |
| `modifier` | `modifier` |             | `string` | `''`        |


## Events

| Event     | Description | Type                |
| --------- | ----------- | ------------------- |
| `clicked` |             | `CustomEvent<void>` |


## Dependencies

### Depends on

- ion-card
- ion-chip

### Graph
```mermaid
graph TD;
  my-component --> ion-card
  my-component --> ion-chip
  ion-card --> ion-ripple-effect
  ion-chip --> ion-ripple-effect
  style my-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
