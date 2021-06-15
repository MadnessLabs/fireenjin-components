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
  Method,
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
  @Prop({ mutable: true }) partials: {id: string; html: string;}[]; 

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
    if (this.partials) {
      this.setPartials(this.partials);
    }
  }

  @Method()
  async setPartials(partials?: {id: string; html: string; }[]) {
    const localPartials = localStorage?.getItem ? JSON.parse(localStorage.getItem(
      "enjin-editor-partials"
    )) : null;
    this.partials = partials ? partials : localPartials ? localPartials : [];
    for (const partial of this.partials) {
      if (!partial.html) continue;
      (window as any).Handlebars.registerPartial(partial.id, partial.html);
    }
    if (localStorage?.setItem) {
      localStorage.setItem("enjin-editor-partials", JSON.stringify(this.partials));
    }
  }

  @Method()
  async renderTemplate() {
    this.html = (window as any).Handlebars.compile(this.template?.html ? this.template?.html : "")(this.data ? this.data : {});
  }

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event?.detail?.endpoint === "findTemplate" && event.detail?.data?.template?.id === this.templateId) {
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

  @Watch("data")
  onData() {
    backoff(10, this.renderTemplate.bind(this));
  }

  @Watch("template")
  onTemplate() {
    backoff(10, this.renderTemplate.bind(this));
  }

  @Watch("partials")
  onPartials() {
    this.setPartials(this.partials);
  }

  render() {
    return <div innerHTML={this.html} />;
  }
}
