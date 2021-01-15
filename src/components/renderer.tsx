import { SelectCompareFn, SelectInterface } from "@ionic/core";

export interface Control {
    name: string;
    icon?: string;
    label?: string;
    value?: any;
    header?: string;
    subHeader?: string;
    message?: string;
    optionEl?: (result: any) => any;
    endpoint?: string;
    query?: string;
    limit?: number;
    orderBy?: string;
    dataPropsMap?: any;
    params?: any;
    multiple?: boolean;
    disabled?: boolean;
    cancelText?: string;
    okText?: string;
    placeholder?: string;
    selectedText?: string;
    interface?: SelectInterface;
    interfaceOptions?: any;
    compareWith?: string | SelectCompareFn | null;
    options?: {
        label: string;
        value: string;
    }[];
}  


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
  