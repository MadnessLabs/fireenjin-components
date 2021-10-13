import { Build, Component, ComponentInterface, Element, Prop, h, Host } from "@stencil/core";
// import * as jKanban from "jkanban";

@Component({
  tag: "fireenjin-kanban",
  styleUrl: "kanban.css"
})
export class Kanban implements ComponentInterface {
  kanban: any;
  @Element() kanbanEl: any;

  @Prop() options: any;

  componentDidLoad() {
    if (Build.isBrowser) {
      // this.kanban = new jKanban({
      //   element: this.kanbanEl,
      //   ...(this.options || {})
      // });
    }
  }

  render() {
    return (
      <Host />
    );
  }
}
