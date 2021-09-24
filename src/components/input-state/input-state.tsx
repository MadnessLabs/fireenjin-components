import { Component, ComponentInterface, Element, Prop, h, Build } from "@stencil/core";

@Component({
  tag: "fireenjin-input-state",
  styleUrl: "input-state.css"
})
export class InputState implements ComponentInterface {
  @Element() stateAutocompleteEl: HTMLElement;

  @Prop() name: string;
  @Prop() placeholder: string;
  @Prop() value: string;

  stateList: any = {
    AK: "Alaska",
    AL: "Alabama",
    AR: "Arkansas",
    AS: "American Samoa",
    AZ: "Arizona",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DC: "District of Columbia",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    GU: "Guam",
    HI: "Hawaii",
    IA: "Iowa",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    MA: "Massachusetts",
    MD: "Maryland",
    ME: "Maine",
    MI: "Michigan",
    MN: "Minnesota",
    MO: "Missouri",
    MS: "Mississippi",
    MT: "Montana",
    NC: "North Carolina",
    ND: " North Dakota",
    NE: "Nebraska",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NV: "Nevada",
    NY: "New York",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    PR: "Puerto Rico",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VA: "Virginia",
    VI: "Virgin Islands",
    VT: "Vermont",
    WA: "Washington",
    WI: "Wisconsin",
    WV: "West Virginia",
    WY: "Wyoming"
  };

  componentDidLoad() {
    if (Build.isBrowser) {
      const ionSelectEl = this.stateAutocompleteEl.querySelector("ion-select");
      ionSelectEl.interfaceOptions = { header: "State" };
    }
  }

  render() {
    return (
      <ion-select
        color="primary"
        name={this.name}
        value={this.value}
        ok-text="Select"
        cancel-text="Cancel"
        placeholder={this.placeholder}
      >
        {Object.keys(this.stateList).map(abbrev => (
          <ion-select-option value={abbrev}>
            {this.stateList[abbrev]}
          </ion-select-option>
        ))}
      </ion-select>
    );
  }
}
