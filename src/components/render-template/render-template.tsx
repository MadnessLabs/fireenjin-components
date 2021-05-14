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

@Component({
  tag: "fireenjin-render-template",
})
export class RenderTemplate implements ComponentInterface {
  @Event() fireenjinFetch: EventEmitter;

  @Prop() templateId: string;
  @Prop() data: any = {};
  @Prop({ mutable: true }) template: any = {};

  @State() html = "";

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event?.detail?.endpoint === "findTemplate") {
      this.template = event?.detail?.data?.template
        ? event.detail.data.template
        : null;
      this.html = this.template?.html ? this.template.html : "";
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

  render() {
    return <div innerHTML={this.html} />;
  }
}
