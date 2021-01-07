import {
    Component,
    ComponentInterface,
    h,
  } from "@stencil/core";

  @Component({
    tag: "fireenjin-renderer",
  })
  export class Renderer implements ComponentInterface {
  
    render() {
      return (
        <ion-content>
            <fireenjin-pagination endpoint="listUsers" limit={24} listEl={({result}: {result: Partial<any>}) => <ion-item>{result.id}</ion-item>} />
        </ion-content>
      );
    }
  }
  