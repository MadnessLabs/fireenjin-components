# fireenjin-input-file

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description               | Type     | Default     |
| -------------- | --------------- | ------------------------- | -------- | ----------- |
| `accept`       | `accept`        |                           | `string` | `undefined` |
| `defaultValue` | `default-value` |                           | `any`    | `undefined` |
| `documentId`   | `document-id`   |                           | `string` | `undefined` |
| `endpoint`     | `endpoint`      | The endpoint to upload to | `string` | `"upload"`  |
| `fileName`     | `file-name`     |                           | `string` | `undefined` |
| `icon`         | `icon`          |                           | `string` | `undefined` |
| `label`        | `label`         |                           | `string` | `undefined` |
| `name`         | `name`          |                           | `string` | `undefined` |
| `path`         | `path`          |                           | `string` | `undefined` |
| `type`         | `type`          |                           | `string` | `"file"`    |
| `uploadData`   | `upload-data`   |                           | `any`    | `{}`        |
| `value`        | `value`         |                           | `any`    | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `fireenjinUpload` |             | `CustomEvent<any>` |
| `ionInput`        |             | `CustomEvent<any>` |


## Methods

### `openFile() => Promise<any>`



#### Returns

Type: `Promise<any>`




## Dependencies

### Depends on

- ion-card
- ion-item
- ion-icon

### Graph
```mermaid
graph TD;
  fireenjin-input-file --> ion-card
  fireenjin-input-file --> ion-item
  fireenjin-input-file --> ion-icon
  ion-card --> ion-ripple-effect
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  style fireenjin-input-file fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
