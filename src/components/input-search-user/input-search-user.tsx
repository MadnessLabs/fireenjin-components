import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Prop,
  h,
} from "@stencil/core";

@Component({
  tag: "fireenjin-input-search-user",
  styleUrl: "input-search-user.css",
})
export class InputSearchUser implements ComponentInterface {
  timer: any;
  inputEl: HTMLIonInputElement;
  inputSearchEl: any;

  @Prop() name: string;
  @Prop() label: string;
  @Prop() placeholder: string = "Search Users";
  @Prop({ mutable: true }) value: any;
  @Prop() required: boolean;
  @Prop() autofocus: boolean;
  @Prop() disableSearch = false;
  @Prop() disabled: boolean;
  @Prop() endpoint: string;
  @Prop() dataPropsMap: any;
  @Prop() mode: "popover" | "inline" = "inline";
  @Prop() iconEnd: string;
  @Prop() iconStart: string;
  @Prop() limit = 5;
  @Prop() template: (result) => any;
  @Prop() results: any[] = [];
  @Prop() lines: "full" | "inset" | "none";
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";

  @Event() ionInput: EventEmitter;
  @Event() fireenjinSelectUser: EventEmitter;

  async selectUser(event, user) {
    this.value = user.email;
    this.fireenjinSelectUser.emit({
      event,
      user,
    });
    setTimeout(async () => {
      await this.inputSearchEl.checkValidity({
        setValidationClass: true,
      });
    }, 200);
    if (this.mode === "popover") {
      await this.inputSearchEl.closePopover();
    } else if (this.mode === "inline") {
      await this.inputSearchEl.clearResults();
    }
  }

  render() {
    return (
      <fireenjin-input-search
        labelPosition={this.labelPosition}
        lines={this.lines}
        iconEnd={this.iconEnd}
        iconStart={this.iconStart}
        mode={this.mode}
        label={this.label}
        ref={(el) => (this.inputSearchEl = el)}
        endpoint="searchUsers"
        resultsKey="searchUsers.results"
        name={this.name}
        searchParams={{
          limit: this.limit ? this.limit : null,
        }}
        results={this.results as any}
        placeholder={this.placeholder}
        value={this.value}
        template={(result) => (
          <ion-item
            onClick={(event) => this.selectUser(event, result)}
            style={{
              cursor: "pointer",
            }}
          >
            <ion-label>
              <h2>
                {result.firstName ? result.firstName : ""}{" "}
                {result.lastName ? result.lastName : ""}
              </h2>
              <p>{result.email ? result.email : "No email on file"}</p>
            </ion-label>
            <ion-icon name="checkmark-circle" />
          </ion-item>
        )}
      >
        <slot name="start" />
        <slot name="end" />
      </fireenjin-input-search>
    );
  }
}
