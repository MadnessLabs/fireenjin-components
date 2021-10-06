import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  h,
  forceUpdate,
  Build
} from "@stencil/core";
import Cleave from "cleave.js";
import "cleave.js/dist/addons/cleave-phone.us";
import { loadStripe } from '@stripe/stripe-js';

@Component({
  tag: "fireenjin-input",
  styleUrl: "input.css"
})
export class Input implements ComponentInterface {
  itemEl: HTMLIonItemElement;
  cardNumberEl: HTMLElement;
  card: any;
  stripe: any;
  modal: HTMLIonModalElement;
  cardValidity: any;
  @Element() inputEl: any;

  @Prop() stripeKey: string;
  @Prop() type: any;
  @Prop() placeholder: any;
  @Prop() label: string;
  @Prop({ mutable: true }) value: any;
  @Prop() required: any;
  @Prop() name: string;
  @Prop() autocomplete: "on" | "off" = "off";
  @Prop() autocapitalize: string;
  @Prop() autocorrect: "on" | "off";
  @Prop() autofocus: boolean;
  @Prop() minlength: number;
  @Prop() maxlength: number;
  @Prop() disabled: boolean;
  @Prop() info: string;
  @Prop() edit: boolean;
  @Prop() min: string;
  @Prop() max: string;
  @Prop() iconLeft: string;
  @Prop() iconRight: string;
  @Prop() silence: boolean;
  @Prop() step: string;
  @Prop() actionOptions: any;
  @Prop() pattern: any;
  @Prop() clearInput = false;
  @Prop() multiple = false;
  @Prop() readOnly = false;
  @Prop() spellCheck = false;
  @Prop() inputMode: string = "text";
  @Prop() stripeElements: {
    style?: any;
    fonts?: any[];
  } = {};
  @Prop() lines: "full" | "inset" | "none";
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";

  @Event() ionChange: EventEmitter;
  @Event() ionInput: EventEmitter;
  @Event() ionBlur: EventEmitter;
  @Event() ionFocus: EventEmitter;

  @State() showInfo: boolean;
  @State() passwordVisible = false;
  @State() cleave: any;
  @State() input: HTMLInputElement;
  @State() inputType: string;

  @Listen("ionBlur")
  async onBlur() {
    const isValid = await this.checkValidity();
    this.inputEl.classList[isValid ? "remove" : "add"]("invalid");
    await this.setValidationClass();
  }

  @Method()
  async getCardToken(
    options: {
      name?: string;
      address_line1?: string;
      address_line2?: string;
      address_city?: string;
      address_state?: string;
      address_zip?: string;
      address_country?: string;
      currency?: string;
    } = {}
  ) {
    return this.stripe.createToken(this.card, {
      address_country: "US",
      currency: "usd",
      ...options
    });
  }

  @Method()
  async setFocus() {
    this.input.focus();
  }

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

    return this.input
      ? this.input.checkValidity()
      : this.type === "card" &&
        this.cardValidity &&
        !this.cardValidity.empty &&
        this.cardValidity.complete &&
        !this.cardValidity.error
        ? true
        : false;
  }

  @Method()
  async clear() {
    this.type === "card"
      ? this.card.clear()
      : (this.inputEl.querySelector("ion-input").value = null);
  }

  @Method()
  async reportValidity() {
    const isValid = this.input ? this.input.reportValidity() : true;
    this.inputEl.classList[isValid ? "remove" : "add"]("invalid");
    await this.setValidationClass();
    return isValid;
  }

  @Watch("value")
  onValueChange() {
    if (!this.cleave) {
      return false;
    }

    this.cleave.setRawValue(this.value ? this.value : null);
  }

  async setValidationClass(options?: { ignoreInvalid?: boolean }) {
    const classList = Object.values(this.itemEl.classList);
    if (classList.indexOf("invalid") >= 0) {
      this.itemEl.classList.remove("invalid");
    }
    if (classList.indexOf("valid") >= 0) {
      this.itemEl.classList.remove("valid");
    }
    if (this.type === "card") {
      if (
        this.cardValidity &&
        !this.cardValidity.empty &&
        !this.cardValidity.error
      ) {
        this.itemEl.classList.add(
          this.cardValidity &&
            !this.cardValidity.empty &&
            this.cardValidity.complete &&
            !this.cardValidity.error
            ? "valid"
            : "invalid"
        );
      }
    } else if (this.input) {
      const isValid = await this.input.checkValidity();
      if (
        !options ||
        !options.ignoreInvalid ||
        (options && options.ignoreInvalid && isValid)
      ) {
        this.itemEl.classList.add(isValid ? "valid" : "invalid");
      }
    }
  }

  componentDidLoad() {
    if (Build.isBrowser) {
      setTimeout(() => {
        this.input = this.inputEl.querySelector("input");
        this.inputType = this.type
          ? this.type === "phone"
            ? "tel"
            : this.type
          : "text";

        if (this.type === "phone") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            phone: true,
            phoneRegionCode: "US",
            delimiter: "-"
          });
        } else if (this.type === "hour") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            numericOnly: true,
            delimiter: ".",
            blocks: [2, 2]
          });
        } else if (this.type === "expiration") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            delimiter: "/",
            numericOnly: true,
            blocks: [2, 2]
          });
        } else if (this.type === "cvc") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            delimiter: "",
            numericOnly: true,
            blocks: [4]
          });
        } else if (this.type === "ssn") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            delimiter: "",
            numericOnly: true,
            blocks: [4]
          });
        } else if (this.type === "code") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            delimiter: "",
            numericOnly: true,
            blocks: [6]
          });
        } else if (this.type === "ein") {
          this.cleave = new Cleave(this.input, {
            onValueChanged: e => {
              this.value = e.target.value;
              forceUpdate(this);
            },
            numericOnly: true,
            blocks: [2, 7],
            delimiter: "-"
          });
        }
      }, 100);
    }
  }

  togglePassword(event: UIEvent) {
    event.stopPropagation();
    const value = this.input.value;
    this.passwordVisible = !this.passwordVisible;
    setTimeout(() => {
      this.value = value;
    }, 50);
  }

  initializeStripeElements() {
    if (!this.stripeKey) {
      console.log("Stripe Key prop is required to create card field.");
      return false;
    }
    this.stripe = (window?.Stripe ? window.Stripe : loadStripe)(this.stripeKey);
    const elements = this.stripe.elements({
      fonts: this.stripeElements.fonts
        ? this.stripeElements.fonts
        : [
          {
            cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans"
          }
        ]
    });

    const classes = {
      base: "native-input native-input-md"
    };

    const style = this.stripeElements.style
      ? this.stripeElements.style
      : {
        base: {
          color: "#000",
          fontFamily: '"Open Sans", arial, sans-serif',
          fontSize: "16px",
          "::placeholder": {
            color: "#999"
          }
        }
      };

    this.card = elements.create("card", {
      hidePostalCode: true,
      style,
      classes
    });
    this.card.mount(this.cardNumberEl);
    this.card.on("blur", event => {
      this.itemEl.classList.remove("item-has-focus", "item-input");
      this.ionBlur.emit({
        event,
        name: this.name ? this.name : "card",
        value:
          this.cardValidity && this.cardValidity.card
            ? this.cardValidity.card
            : null,
        validity:
          this.cardValidity &&
            !this.cardValidity.empty &&
            this.cardValidity.complete &&
            !this.cardValidity.error
            ? true
            : false
      });
    });
    this.card.on("change", event => {
      if (this.required) {
        this.setValidationClass(event);
      }
      this.cardValidity = event;
      const eventPayload = {
        event,
        name: this.name ? this.name : "card",
        value: event.card,
        validity:
          this.cardValidity &&
            !this.cardValidity.empty &&
            this.cardValidity.complete &&
            !this.cardValidity.error
            ? true
            : false
      };
      this.ionChange.emit(eventPayload);
      this.ionInput.emit(eventPayload);
    });
    this.card.on("focus", event => {
      this.itemEl.classList.add("item-has-focus", "item-input");
      this.ionFocus.emit({
        event,
        name: this.name ? this.name : "card",
        validity:
          this.cardValidity &&
            !this.cardValidity.empty &&
            this.cardValidity.complete &&
            !this.cardValidity.error
            ? true
            : false
      });
    });
  }

  dateToYearMonthDay(timestamp: any): string {
    const d = new Date(+timestamp);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  renderInput() {
    if (this.type === "card") {
      setTimeout(() => {
        this.initializeStripeElements();
      }, 200);

      return <div id="card-number" ref={el => (this.cardNumberEl = el)} />;
    } else if (this.type === "expiration") {
      return <div id="card-expiry" />;
    } else if (this.type === "cvc") {
      return <div id="card-cvc" />;
    } else {
      const inputType: any =
        this.inputType && !this.passwordVisible
          ? this.inputType
          : this.type === "phone" ||
            this.type === "hours" ||
            this.type === "date"
            ? "tel"
            : "text";

      return (
        <ion-input
          type={inputType}
          name={this.name}
          spellcheck={this.spellCheck}
          readonly={this.readOnly}
          multiple={this.multiple}
          clearInput={this.clearInput}
          inputMode={this.inputMode}
          pattern={
            this.pattern
              ? this.pattern
              : this.type === "phone"
                ? "[0-9]{3}-[0-9]{3}-[0-9]{4}"
                : this.type === "ssn"
                  ? "[0-9]{4}"
                  : this.type === "date"
                    ? "[0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}"
                    : this.type === "code"
                      ? "[0-9]{6}"
                      : this.type === "expiration"
                        ? "[0-9]{2}/[0-9]{2}"
                        : this.type === "cvc"
                          ? "[0-9]{3,4}"
                          : null
          }
          value={
            this.type === "date"
              ? this.dateToYearMonthDay(this.value)
              : this.value
          }
          placeholder={this.placeholder}
          required={this.required}
          autofocus={this.autofocus}
          autocomplete={this.autocomplete}
          autocorrect={this.autocorrect}
          autocapitalize={this.autocapitalize}
          minlength={this.type === "phone" ? 12 : this.minlength}
          maxlength={this.type === "phone" ? 12 : this.maxlength}
          disabled={this.disabled}
          min={this.min}
          max={this.max}
          step={this.step}
        />
      );
    }
  }

  render() {
    return (
      <ion-item
        ref={el => (this.itemEl = el)}
        lines={this.lines}
        class={{
          "input-password item-input": this.inputType === "password",
          "input-card": this.inputType === "card",
          "has-info-bubble": !!this.info
        }}
      >
        {this.iconLeft && <ion-icon name={this.iconLeft} slot="start" />}
        {this.label && (
          <ion-label position={this.labelPosition}>
            <span>{this.label}</span>
          </ion-label>
        )}
        {this.renderInput()}
        {this.type === "password" && (
          <div class="input-icon">
            <ion-icon
              name={this.passwordVisible ? "eye-off" : "eye"}
              onClick={(event: UIEvent) => this.togglePassword(event)}
            />
          </div>
        )}
        {this.iconRight && <ion-icon name={this.iconRight} slot="start" />}
      </ion-item>
    );
  }
}
