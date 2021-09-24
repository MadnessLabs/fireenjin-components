import { Component, ComponentInterface, Prop, h } from "@stencil/core";

@Component({
  tag: "fireenjin-tab",
  styleUrl: "tab.css",
})
export class Tab implements ComponentInterface {
  @Prop() tab: string;
  @Prop() selected = false;

  render() {
    return (
      <div
        class={{
          "tab-selected": this.selected,
          "tab-deselected": !this.selected,
          "tab-wrapper": true,
        }}
      >
        <slot />
      </div>
    );
  }
}
