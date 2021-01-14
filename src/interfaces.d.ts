import { SelectCompareFn, SelectInterface } from "@ionic/core";

export declare interface Control {
    name: string;
    icon?: string;
    label?: string;
    value?: string;
    header?: string;
    subHeader?: string;
    message?: string;
    optionEl?: (result: any) => HTMLIonSelectOptionElement;
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
