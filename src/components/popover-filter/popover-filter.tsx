import { Component, ComponentInterface, h, Prop } from "@stencil/core";
import { Control } from "../renderer";

@Component({
  tag: "fireenjin-popover-filter",
  styleUrl: "popover-filter.css",
})
export class PopoverFilter implements ComponentInterface {
  @Prop() label: string;
  @Prop() controls: Control[];

  render() {
    return (
      <ion-content
        style={{
          "--background": "var(--ion-color-base)",
        }}
      >
        <fireenjin-form disableLoader name="filter">
          {this.label && <ion-item-divider>{this.label}</ion-item-divider>}
          {this.controls?.length
            ? this.controls.map((control) => <fireenjin-select {...control} />)
            : null}
        </fireenjin-form>
      </ion-content>
    );
  }
}
