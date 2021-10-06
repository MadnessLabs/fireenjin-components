import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  h,
  Build,
} from "@stencil/core";

declare var google;

@Component({
  tag: "fireenjin-input-address",
  styleUrl: "input-address.css",
})
export class InputAddress implements ComponentInterface {
  autocompleteFieldEl: HTMLIonInputElement;
  streetInputEl: HTMLIonInputElement;
  unitInputEl: HTMLIonInputElement;
  stateSelectEl: any;
  cityInputEl: HTMLIonInputElement;
  zipInputEl: HTMLIonInputElement;

  @Element() addressAutocompleteEl: any;

  /**
   * The placeholder text for the input field
   */
  @Prop() placeholder: string;
  /**
   * The value of the input field
   */
  @Prop({ mutable: true }) value: any = {};
  /**
   * The label of the input field
   */
  @Prop() label: string;
  /**
   * Whether the address input is required
   */
  @Prop() required: boolean;
  /**
   * The name attribute of the input
   */
  @Prop() name: string;
  /**
   * The Google Maps API Key
   */
  @Prop() googleMapsKey: string;
  @Prop() lines: "full" | "inset" | "none";
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";

  @State() place: any;
  @State() manualEntry = false;
  @State() forceUpdate: boolean;

  @Event() ionInput: EventEmitter;
  @Event() fireenjinAddressMode: EventEmitter;
  @Event() fireenjinUpdateAutoHeight: EventEmitter;

  @Listen("ionChange")
  onChange() {
    if (this.manualEntry) {
      setTimeout(() => {
        const fullAddress = `${this.streetInputEl.value},${this.unitInputEl.value ? ` ${this.unitInputEl.value},` : ""
          } ${this.cityInputEl.value}, ${this.stateSelectEl.querySelector("ion-select").value
          } ${this.zipInputEl.value}`;
        this.autocompleteFieldEl.value = fullAddress;
        this.value.full = fullAddress;
        this.ionInput.emit({
          name: this.name,
          value: this.value,
        });
      }, 100);
    }
  }

  injectScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      script.addEventListener("load", resolve);
      script.addEventListener("error", () => reject("Error loading script."));
      script.addEventListener("abort", () => reject("Script loading aborted."));
      document.head.appendChild(script);
    });
  }

  async componentWillLoad() {
    if (Build.isBrowser) {
      try {
        if (this.googleMapsKey && !window?.google?.maps) {
          await this.injectScript(
            `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsKey}&libraries=places`
          );
        }
      } catch (e) {
        console.log("Error injecting Google Maps");
      }
    }
  }

  async componentDidLoad() {
    if (Build.isBrowser) {
      const inputEl = await this.autocompleteFieldEl.getInputElement();
      setTimeout(() => {
        inputEl.setAttribute("autocomplete", "new-password");
      }, 200);
      const autocomplete = new google.maps.places.Autocomplete(inputEl, {
        types: ["address"],
      });

      google.maps.event.addListener(autocomplete, "place_changed", () => {
        this.place = autocomplete.getPlace();
        if (!this.value) {
          this.value = {};
        }
        this.value.full = this.place.formatted_address;

        let streetAddress = "";
        this.value.placeId = this.place?.place_id;
        this.value.lat = this.place?.geometry?.location?.lat();
        this.value.lng = this.place?.geometry?.location?.lng();
        this.place.address_components.map((field, index) => {
          if (field.types.indexOf("street_number") !== -1) {
            streetAddress = field.long_name;
          }
          if (field.types.indexOf("route") !== -1) {
            streetAddress = streetAddress + " " + field.long_name;
          }
          if (field.types.indexOf("locality") !== -1) {
            this.value.city = field.long_name;
          }
          if (field.types.indexOf("postal_code") !== -1) {
            this.value.zip = field.short_name;
          }
          if (field.types.indexOf("administrative_area_level_1") !== -1) {
            this.value.state = field.short_name;
          }

          if (this.place.address_components.length === index + 1) {
            this.value.street = streetAddress;
          }

          if (index === this.place.address_components.length - 1) {
            setTimeout(() => {
              this.ionInput.emit({
                name: this.name,
                value: this.value,
              });
            }, 10);
          }
        });
      });
    }
  }

  toggleManualEntry() {
    this.manualEntry = !this.manualEntry;
    if (this.manualEntry) {
      this.value = {
        city: this.cityInputEl.value as string,
        country: "US",
        full: this.autocompleteFieldEl.value as string,
        state: this.stateSelectEl.value,
        street: this.streetInputEl.value as string,
        unit: this.unitInputEl.value as string,
        zip: this.zipInputEl.value as string,
      };
    }
    this.fireenjinAddressMode.emit({ maual: this.manualEntry });
    this.fireenjinUpdateAutoHeight.emit();
    setTimeout(() => {
      this.addressAutocompleteEl.forceUpdate();
    }, 0);
  }

  render() {
    const value = this.value ? this.value : {};
    return [
      <ion-item lines={this.lines} class={{ "is-hidden": !this.manualEntry }}>
        <ion-label position={this.labelPosition}>{this.label}</ion-label>
        <div class="manual-fields">
          <ion-input
            ref={(el) => (this.streetInputEl = el)}
            type="text"
            name={this.name + ".street"}
            placeholder="Street Address"
            value={value.street}
            required={this.required && this.manualEntry}
          />
          <ion-input
            ref={(el) => (this.unitInputEl = el)}
            type="text"
            name={this.name + ".unit"}
            placeholder="Street Address 2"
            value={value.unit}
          />
          <ion-input
            ref={(el) => (this.cityInputEl = el)}
            type="text"
            name={this.name + ".city"}
            placeholder="City"
            value={value.city}
            required={this.required && this.manualEntry}
          />
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <fireenjin-input-state
                  ref={(el) => (this.stateSelectEl = el)}
                  name={this.name + ".state"}
                  value={value.state}
                  placeholder="State"
                />
              </ion-col>
              <ion-col size="6">
                <ion-input
                  ref={(el) => (this.zipInputEl = el)}
                  class="zip-input"
                  type="tel"
                  name={this.name + ".zip"}
                  min="0"
                  max="999999"
                  value={value.zip}
                  placeholder="Zip Code"
                  required={this.required && this.manualEntry}
                />
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <ion-button
          fill="clear"
          color="primary"
          onClick={() => this.toggleManualEntry()}
          slot="end"
        >
          <span class="button-inner">
            Search
            <ion-icon name="search" />
          </span>
        </ion-button>
      </ion-item>,
      <ion-item class={{ "is-hidden": this.manualEntry }}>
        <ion-label position="stacked">{this.label}</ion-label>
        <ion-input
          ref={(el) => (this.autocompleteFieldEl = el)}
          class="autocomplete-field"
          type="text"
          placeholder={this.placeholder}
          value={value.full}
          autocomplete="off"
          required={this.required && !this.manualEntry}
        />
        <ion-button
          fill="clear"
          color="primary"
          onClick={() => this.toggleManualEntry()}
          slot="end"
        >
          <span class="button-inner">
            Manual
            <ion-icon name="create" />
          </span>
        </ion-button>
      </ion-item>,
    ];
  }
}
