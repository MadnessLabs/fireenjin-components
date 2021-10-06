import { Build, Component, h, Prop } from "@stencil/core";

@Component({
  tag: "fireenjin-input-json",
  styleUrl: "input-json.css",
})
export class InputJson {
  @Prop() value: any = {};
  @Prop() label: string;
  @Prop() name = "json";
  @Prop() lines: "full" | "inset" | "none";
  @Prop() labelPosition?: "stacked" | "fixed" | "floating";

  componentDidLoad() {
    if (Build.isBrowser) {
      // Get Data
    }
  }

  render() {
    return (
      <ion-item lines={this.lines} style={{ overflow: "visible" }}>
        {this.label && <ion-label position={this.labelPosition}>{this.label}</ion-label>}
        <fireenjin-json-editor
          style={{ width: "100%", marginTop: "15px" }}
          name={this.name}
          value={this.value ? this.value : {}}
        />
      </ion-item>
    );
  }
}
