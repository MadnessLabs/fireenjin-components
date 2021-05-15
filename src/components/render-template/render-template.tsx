import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Prop,
  h,
  Watch,
  State,
  Listen,
} from "@stencil/core";
import backoff from "../../helpers/backoff";
import injectScript from "../../helpers/injectScript";

@Component({
  tag: "fireenjin-render-template"
})
export class RenderTemplate implements ComponentInterface {
  @Event() fireenjinFetch: EventEmitter;

  @Prop() templateId: string;
  @Prop() data: any = {};
  @Prop({ mutable: true }) template: any = {};

  @State() html = "";

  componentWillLoad() {
    if (!(window as any)?.Handlebars) injectScript('https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js');
    if (this.templateId) this.fireenjinFetch.emit({
      endpoint: "findTemplate",
      params: {
        id: this.templateId
      }
    });
  }

  componentDidLoad() {
    backoff(10, this.renderTemplate.bind(this));
  }

  renderTemplate() {
    this.html = (window as any).Handlebars.compile(this.template?.html ? this.template?.html : "")(this.data ? this.data : {});
  }

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event?.detail?.endpoint === "findTemplate") {
      this.template = event?.detail?.data?.template
        ? event.detail.data.template
        : null;
    }
  }

  @Watch("templateId")
  onTemplateId() {
    this.fireenjinFetch.emit({
      endpoint: "findTemplate",
      params: {
        id: this.templateId,
      },
    });
  }

  @Watch("template")
  onTemplate() {
    backoff(10, this.renderTemplate.bind(this));
  }

  render() {
    return <div innerHTML={this.html} />;
  }
}
