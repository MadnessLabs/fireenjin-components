import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  Watch,
  h,
  Build,
} from "@stencil/core";

@Component({
  tag: "fireenjin-input-amount",
  styleUrl: "input-amount.css",
})
export class InputAmount implements ComponentInterface {
  inputEl: HTMLIonInputElement;

  @Prop() name: string;
  @Prop() label: string;
  @Prop() placeholder: string;
  @Prop({ mutable: true }) value: any;
  @Prop() required: boolean;
  @Prop() presets: ({ label?: string; value: any } | string)[];
  @Prop() decimal: boolean;
  @Prop() autofocus: boolean;
  @Prop() disabled: boolean;
  @Prop() min: string;
  @Prop() max: string;
  @Prop() step = "0.01";
  @Prop() lines: "full" | "inset" | "none";
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";

  @State() formattedValue: string;

  @Event() ionInput: EventEmitter;
  @Event() ionChange: EventEmitter;

  @Listen("ionBlur")
  onChange(event) {
    this.formattedValue = this.formatCurrency(event.target.value);
  }

  @Watch("value")
  onValueChange(newValue, oldValue) {
    if (newValue === oldValue) return false;
    this.formattedValue = this.formatCurrency(this.value);
  }

  formatCurrency(amount: any) {
    if (!amount || isNaN(parseFloat(amount))) {
      this.value = null;
      this.inputEl.value = null;
      return null;
    }
    const formattedAmount = Number(
      parseFloat((amount + "").replace(",", "")).toFixed(2)
    );
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    document.querySelectorAll(".presets span").forEach((span) => {
      if (
        +formattedAmount ===
        +parseFloat(
          (span.textContent + "")
            .replace(",", "")
            .replace("$", "")
            .replace(" ", "")
        ).toFixed(2)
      ) {
        span.classList.add("selected");
      } else {
        span.classList.remove("selected");
      }
    });

    this.value = formattedAmount;

    setTimeout(() => {
      this.ionInput.emit({
        name: this.name,
        value: formattedAmount,
      });
      this.ionChange.emit({
        name: this.name,
        value: formattedAmount,
      });
    }, 200);

    return formatter.format(formattedAmount).replace("$", "");
  }

  componentDidLoad() {
    if (Build.isBrowser) {
      this.formattedValue = this.formatCurrency(this.value);
    }
  }

  selectPreset(preset: { label?: string; value: any } | string) {
    this.formattedValue = this.formatCurrency(
      typeof preset === "string" ? preset : preset?.value ? preset.value : 0
    );
  }

  render() {
    return (
      <ion-item lines={this.lines}>
        <ion-icon name="logo-usd" slot="start" />
        {this.label && <ion-label position={this.labelPosition}>{this.label}</ion-label>}
        {this.presets && this.presets.length && (
          <div class="presets" slot="end">
            {this.presets.map((preset) => (
              <span onClick={() => this.selectPreset(preset)}>
                {typeof preset === "string"
                  ? preset
                  : preset?.label
                    ? preset.label
                    : preset?.value
                      ? preset.value
                      : ""}
              </span>
            ))}
          </div>
        )}
        <ion-input
          min={this.min}
          max={this.max}
          ref={(el) => (this.inputEl = el)}
          disabled={this.disabled}
          inputmode="decimal"
          type="tel"
          step={this.step}
          placeholder={this.placeholder}
          required={this.required}
          autofocus={this.autofocus}
          value={this.formattedValue}
        />
      </ion-item>
    );
  }
}
