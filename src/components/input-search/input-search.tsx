import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Prop,
  h,
  Listen,
  Method,
} from "@stencil/core";
import Debounce from "debounce-decorator";
import { popoverController, TextFieldTypes } from "@ionic/core";
import pathToValue from "../../helpers/pathToValue";

@Component({
  tag: "fireenjin-input-search",
  styleUrl: "input-search.css",
})
export class InputSearch implements ComponentInterface {
  itemEl: HTMLIonItemElement;
  timer: any;
  resultsPopover: HTMLIonPopoverElement;
  inputEl: HTMLIonInputElement;

  @Prop() name: string;
  @Prop() label: string;
  @Prop() placeholder: string;
  @Prop({ mutable: true }) value: any;
  @Prop() required: boolean;
  @Prop() autofocus: boolean;
  @Prop() disabled: boolean;
  @Prop() endpoint: string;
  @Prop() dataPropsMap: any;
  @Prop() template: (result) => any;
  @Prop() type: TextFieldTypes = "text";
  @Prop() searchParams: any = {};
  @Prop() disableSearch = false;
  @Prop() mode: "popover" | "inline" = "popover";
  @Prop() iconEnd: string;
  @Prop() iconStart: string;
  @Prop({ mutable: true }) results: any[] = [];
  @Prop() resultsKey: string;
  @Prop() lines: "full" | "inset" | "none";
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";


  @Event() ionInput: EventEmitter;
  @Event() fireenjinFetch: EventEmitter;

  @Method()
  async checkValidity(options?: {
    setValidationClass?: boolean;
    validationClassOptions?: {
      ignoreInvalid?: boolean;
    };
  }) {
    if (this.required || (options && options.setValidationClass)) {
      await this.setValidationClass(
        options && options.validationClassOptions
          ? options.validationClassOptions
          : null
      );
    }

    return this.inputEl
      ? await (await this.inputEl.getInputElement()).checkValidity()
      : true;
  }

  @Method()
  async reportValidity() {
    const isValid = this.inputEl
      ? await (await this.inputEl.getInputElement()).reportValidity()
      : true;
    this.inputEl.classList[isValid ? "remove" : "add"]("invalid");
    await this.setValidationClass();

    return isValid;
  }

  @Listen("ionBlur")
  async onBlur() {
    const isValid = await this.checkValidity();
    this.inputEl.classList[isValid ? "remove" : "add"]("invalid");
    await this.setValidationClass();
  }

  @Listen("fireenjinSuccess", { target: "body" })
  async onSuccess(event) {
    if (event?.detail?.endpoint !== this.endpoint || !event?.detail?.data)
      return;
    this.results = await pathToValue(
      event.detail.data,
      this.resultsKey ? this.resultsKey : "searchUsers.results"
    );
    console.log(this.results);
    if (this.mode === "popover") {
      this.resultsPopover = await popoverController.create({
        translucent: true,
        showBackdrop: false,
        event: event.detail.event,
        component: "fireenjin-input-search-popover",
        componentProps: {
          results: this.results,
          template: this.template,
        },
      });
      this.resultsPopover.present();
    }
  }

  @Debounce(1000)
  onInput(event) {
    if (this.disableSearch || event?.target?.value?.length <= 1) return;
    this.fireenjinFetch.emit({
      event,
      endpoint: this.endpoint,
      params: {
        data: {
          query: event.target.value,
          ...this.searchParams,
        },
      },
      dataPropsMap: this.dataPropsMap,
    });
  }

  @Method()
  async clearResults() {
    return (this.results = []);
  }

  @Method()
  async closePopover() {
    return this.resultsPopover.dismiss();
  }

  @Method()
  async openPopover() {
    return this.resultsPopover.present();
  }

  async setValidationClass(options?: { ignoreInvalid?: boolean }) {
    const classList = Object.values(this.itemEl.classList);
    if (classList.indexOf("invalid") >= 0) {
      this.itemEl.classList.remove("invalid");
    }
    if (classList.indexOf("valid") >= 0) {
      this.itemEl.classList.remove("valid");
    }
    const isValid = await (
      await this.inputEl.getInputElement()
    ).checkValidity();
    if (
      !options ||
      !options.ignoreInvalid ||
      (options && options.ignoreInvalid && isValid)
    ) {
      this.itemEl.classList.add(isValid ? "valid" : "invalid");
    }
  }

  render() {
    return [
      <ion-item
        lines={this.lines}
        class="search-input"
        ref={(el) => (this.itemEl = el)}
        onClick={(event) => this.onInput(event)}
      >
        <slot name="start" />
        {this.iconStart && <ion-icon name={this.iconStart} slot="start" />}
        {this.label && <ion-label position={this.labelPosition}>{this.label}</ion-label>}
        <ion-input
          onInput={(event) => this.onInput(event)}
          ref={(el) => (this.inputEl = el)}
          disabled={this.disabled}
          type={this.type}
          name={this.name}
          placeholder={this.placeholder}
          required={this.required}
          autofocus={this.autofocus}
          value={this.value}
        />
        {this.iconEnd && <ion-icon name={this.iconEnd} slot="end" />}
        <slot name="end" />
      </ion-item>,
      this.mode === "inline" && this.results?.length
        ? this.results.map((result) => this.template(result))
        : null,
    ];
  }
}
