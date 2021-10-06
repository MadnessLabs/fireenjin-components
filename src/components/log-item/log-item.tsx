import { Component, ComponentInterface, Prop, h } from "@stencil/core";
import { format } from "date-fns";

@Component({
  tag: "fireenjin-log-item",
  styleUrl: "log-item.css",
})
export class LogItem implements ComponentInterface {
  @Prop() type: string;
  @Prop() name: string;
  @Prop() resolveTime: number;
  @Prop() input: string;
  @Prop() output: string;
  @Prop() createdAt: string;
  @Prop() lines: "full" | "inset" | "none";

  formatDate(timestamp: string) {
    return format(new Date(Date.parse(timestamp)), "MM/dd/yyyy @ hh:mm aaa");
  }

  render() {
    return (
      <ion-item lines={this.lines}>
        <ion-label class="ion-text-wrap">
          <ion-grid>
            <ion-row>
              <ion-col>
                <h2>
                  {this.type} - {this.name}{" "}
                  {this.resolveTime ? `(${this.resolveTime}ms)` : ""}
                </h2>
              </ion-col>
              <ion-col
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <small
                  style={{
                    color: "var(--ion-color-medium)",
                  }}
                >
                  {this.formatDate(this.createdAt)}
                </small>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <h3>Input</h3>
                <fireenjin-json-viewer
                  innerHTML={
                    typeof this.input === "object"
                      ? JSON.stringify(this.input)
                      : this.input
                  }
                />
              </ion-col>
              <ion-col>
                <h3>Output</h3>
                <fireenjin-json-viewer
                  innerHTML={
                    typeof this.output === "object"
                      ? JSON.stringify(this.output)
                      : this.output
                  }
                />
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-label>
      </ion-item>
    );
  }
}
