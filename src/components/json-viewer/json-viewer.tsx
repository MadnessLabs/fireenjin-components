import {
  Component,
  ComponentInterface,
  Element,
  Prop,
  h,
  Method,
} from "@stencil/core";

import JSONFormatter from "json-formatter-js";

@Component({
  tag: "fireenjin-json-viewer",
  styleUrl: "json-viewer.css",
})
export class JsonViewer implements ComponentInterface {
  timer: number;
  lastValue: any;

  @Element() jsonViewerEl: any;

  @Prop() watcher = false;
  @Prop() openDepth = 1;

  @Method()
  async formatStringJSON(str: string) {
    if (!str || !JSON.parse(str)) return;
    const formatter = new JSONFormatter(JSON.parse(str), this.openDepth, {});
    this.jsonViewerEl.innerHTML = "";
    const codeEl = document.createElement("code");
    codeEl.appendChild(formatter.render());
    this.jsonViewerEl.appendChild(codeEl);
  }

  connectedCallback() {
    if (!this.watcher) return;
    this.timer = window.setInterval(() => {
      try {
        if (JSON.parse(this.jsonViewerEl.innerText))
          this.formatStringJSON(this.jsonViewerEl.innerText);
      } catch (e) {
        // No need to log
      }
    }, 250);
  }

  disconnectedCallback() {
    if (!this.watcher) return;
    window.clearInterval(this.timer);
  }

  componentDidLoad() {
    setTimeout(() => {
      try {
        if (JSON.parse(this.jsonViewerEl.innerText))
          this.formatStringJSON(this.jsonViewerEl.innerText);
      } catch (e) {
        // No need to log
      }
    }, 200);
  }

  render() {
    return <slot />;
  }
}
