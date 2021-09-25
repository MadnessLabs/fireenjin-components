import { SelectCompareFn, SelectInterface } from "@ionic/core";

export type filterControl = {
  resultsKey?: string;
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
};
