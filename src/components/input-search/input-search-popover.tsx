import { Component, ComponentInterface, Prop } from "@stencil/core";

@Component({
  tag: "fireenjin-input-search-popover"
})
export class InputSearchPopover implements ComponentInterface {
  @Prop() name: string;
  @Prop() results: any = [];
  @Prop() template: (result) => any;

  render() {
    return this.results.map(result => this.template(result));
  }
}
