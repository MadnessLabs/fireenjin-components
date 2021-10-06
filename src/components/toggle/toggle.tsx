import { Color } from "@ionic/core";
import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "fireenjin-toggle",
  styleUrl: "toggle.css",
})
export class Toggle {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() value: boolean;
  @Prop() color: Color;
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";
  /**
   * If `true`, the user cannot interact with the select.
   */
  @Prop() disabled = false;
  @Prop() lines: "full" | "inset" | "none";

  render() {
    return (
      <ion-item lines={this.lines}>
        <slot name="start" slot="start" />
        {this.label && <ion-label position={this.labelPosition}>{this.label}</ion-label>}
        <ion-toggle disabled={this.disabled} color={this.color} name={this.name} checked={!!this.value} />
        <slot name="end" slot="after" />
      </ion-item>
    );
  }
}
