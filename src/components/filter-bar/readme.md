# fireenjin-filter-bar



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                                                                                                                                       | Default     |
| -------------- | --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `filter`       | --              |             | `{ label?: string; controls: Control[]; }`                                                                                                 | `undefined` |
| `modeToggle`   | `mode-toggle`   |             | `boolean`                                                                                                                                  | `false`     |
| `paginationEl` | `pagination-el` |             | `any`                                                                                                                                      | `undefined` |
| `sort`         | --              |             | `{ label?: string; value?: string; header?: string; subHeader?: string; message?: string; options: { label: string; value: string; }[]; }` | `undefined` |


## Methods

### `clearFilter(event: any, clearingControl: Control) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `openFilterPopover(event: any) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `togglePaginationDisplay() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- ion-grid
- ion-row
- ion-col
- ion-button
- ion-icon
- ion-searchbar
- ion-card
- ion-chip
- ion-label
- ion-select
- ion-select-option

### Graph
```mermaid
graph TD;
  fireenjin-filter-bar --> ion-grid
  fireenjin-filter-bar --> ion-row
  fireenjin-filter-bar --> ion-col
  fireenjin-filter-bar --> ion-button
  fireenjin-filter-bar --> ion-icon
  fireenjin-filter-bar --> ion-searchbar
  fireenjin-filter-bar --> ion-card
  fireenjin-filter-bar --> ion-chip
  fireenjin-filter-bar --> ion-label
  fireenjin-filter-bar --> ion-select
  fireenjin-filter-bar --> ion-select-option
  ion-button --> ion-ripple-effect
  ion-searchbar --> ion-icon
  ion-card --> ion-ripple-effect
  ion-chip --> ion-ripple-effect
  style fireenjin-filter-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
