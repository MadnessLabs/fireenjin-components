import { SelectCompareFn, SelectInterface } from "@ionic/core";
import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  h,
  Build,
  State,
  Element,
} from "@stencil/core";

@Component({
  tag: "fireenjin-select",
  styleUrl: "select.css",
})
export class Select implements ComponentInterface {
  @Element() selectEl: HTMLFireenjinSelectElement;

  @Event() fireenjinFetch: EventEmitter;

  /**
  * If `true`, the user cannot interact with the select.
  */
  @Prop() disabled = false;
  /**
   * The text to display on the cancel button.
   */
  @Prop() cancelText = 'Dismiss';
  /**
   * The text to display on the ok button.
   */
  @Prop() okText = 'Okay';
  /**
   * The text to display when the select is empty.
   */
  @Prop() placeholder?: string | null;
  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string;
  /**
   * The text to display instead of the selected option's value.
   */
  @Prop() selectedText?: string | null;
  /**
   * If `true`, the select can accept multiple values.
   */
  @Prop() multiple = false;
  /**
   * The interface the select should use: `action-sheet`, `popover` or `alert`.
   */
  @Prop() interface: SelectInterface = 'alert';
  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface
   * can take. See the [ion-alert docs](../alert), the
   * [ion-action-sheet docs](../action-sheet) and the
   * [ion-popover docs](../popover) for the
   * create options for each interface.
   *
   * Note: `interfaceOptions` will not override `inputs` or `buttons` with the `alert` interface.
   */
  @Prop() interfaceOptions: any = {};
  /**
   * A property name or function used to compare object values
   */
  @Prop() compareWith?: string | SelectCompareFn | null;
  /**
   * the value of the select.
   */
  @Prop({ mutable: true }) value?: any | null;
  @Prop() icon?: string;
  @Prop() endpoint?: string;
  @Prop() header?: string;
  @Prop() subHeader?: string;
  @Prop() message?: string;
  @Prop() orderBy?: string;
  @Prop() dataPropsMap?: any;
  @Prop() optionEl?: (result: any) => HTMLIonSelectOptionElement;
  @Prop() limit = 15;
  @Prop() params?: any;
  @Prop() query?: string;
  @Prop() label: string;
  @Prop({ mutable: true }) options: {
    label?: string;
    value?: any;
    disabled?: boolean;
    payload?: any;
  }[] = [];
  @Prop() resultsKey?: string;
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";
  @Prop() lines: "full" | "inset" | "none";

  @State() results: any[] = [];

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event?.detail?.name !== "select" || event.detail.endpoint !== this.endpoint) return;
    this.results = event?.detail?.data?.results
      ? event.detail.data.results
      : [];
    setTimeout(() => {
      this.value = this.value;
    }, 200);
  }

  fetchData() {
    if (!this.endpoint) return;
    this.fireenjinFetch.emit({
      name: "select",
      endpoint: this.endpoint,
      dataPropsMap: this.dataPropsMap ? this.dataPropsMap : this.resultsKey ? { [this.resultsKey]: "results" } : null,
      params: {
        data: {
          ...(this.query ? { query: this.query } : {}),
          ...(this.orderBy ? { orderBy: this.orderBy } : {}),
          limit: this.limit ? this.limit : 15,
        },
        ...(this.params ? this.params : {}),
      },
    });
  }

  componentWillLoad() {
    if (!Build.isBrowser) return;
    this.fetchData();
  }

  render() {
    return (
      <Host>
        <ion-item lines={this.lines}>
          {this.icon && <ion-icon slot="start" name={this.icon} />}
          {this.label && <ion-label position={this.labelPosition}>{this.label}</ion-label>}
          <ion-select
            disabled={this.disabled}
            selectedText={this.selectedText}
            interface={this.interface}
            compareWith={this.compareWith}
            name={this.name}
            value={this.value}
            okText={this.okText}
            multiple={this.multiple}
            cancelText={this.cancelText}
            placeholder={this.placeholder}
            interfaceOptions={this.interfaceOptions ? this.interfaceOptions : {
              header: this.header,
              subHeader: this.subHeader,
              message: this.message,
            }}
          >
            {(this.options ? this.options : []).map((option) => this.optionEl ? (
              this.optionEl(option)
            ) : (
              <ion-select-option
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </ion-select-option>
            ))}
            {(this.results ? this.results : []).map((result) =>
              this.optionEl ? (
                this.optionEl(result)
              ) : (
                <ion-select-option value={result.id}>
                  {result.name}
                </ion-select-option>
              )
            )}
          </ion-select>
        </ion-item>
      </Host>
    );
  }
}
