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
    options?: {
        label: string;
        value: string;
    }[];
}  
