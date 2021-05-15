import { JSONEditor } from "svelte-jsoneditor";
import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Host,
  Prop,
  h,
  Watch,
  Method,
  Build,
} from "@stencil/core";

@Component({
  tag: "fireenjin-json-editor",
  styleUrl: "json-editor.css",
})
export class JsonEditor implements ComponentInterface {
  editorEl;
  editor;

  @Event() ionChange: EventEmitter;
  @Event() ionInput: EventEmitter;

  @Prop() name = "json";
  @Prop({ mutable: true }) value;
  @Prop() label: string;
  @Prop() mode: "tree" | "code" = "tree";

  @Watch("value")
  @Method()
  async update(value, lastValue) {
    if (!this.editor || lastValue === value) return;
    this.editor.update(value);
  }

  @Method()
  async set(value) {
    if (!this.editor) return;
    this.editor.set(value);
  }

  componentDidLoad() {
    if (!Build?.isBrowser) return; 
    this.editor = new JSONEditor({
      target: this.editorEl,
      props: {
        json: this.value ? this.value : {},
        mode: this.mode ? this.mode : "tree",
        onChange: (content) => {
          this.value = content.json;
          this.ionChange.emit();
          this.ionInput.emit();
        },
      },
    });
  }

  render() {
    return (
        <Host ref={(el) => (this.editorEl = el)} />
    );
  }
}
