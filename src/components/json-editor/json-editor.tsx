import JSONEditor from "jsoneditor";
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
  assetsDirs: ["assets"]
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
  @Prop() modes: ("code" | "form" | "text" | "tree" | "view" | "preview")[] = ["tree", "code"];
  @Prop() editorOptions: any = {};

  @Method()
  async get() {
    if (!this.editor) return;
    return this.editor.get();
  }

  @Watch("value")
  @Method()
  async set(value) {
    try { 
      if (!this.editor?.get || JSON.stringify(this.editor.get()) === JSON.stringify(value)) return;
      this.editor.set(value);
    } catch { }
  }

  componentDidLoad() {
    if (Build.isBrowser) {
      this.editor = new JSONEditor(this.editorEl, {
        json: this.value ? this.value : {},
        modes: this.modes ? this.modes : ["tree", "code"],
        mode: this.mode ? this.mode : "tree",
        onChange: () => {
          this.value = this.editor.get();
          this.ionChange.emit();
          this.ionInput.emit();
        },
        value: this.value,
        ...this.editorOptions
      });
      if (this.value) {
        this.set(this.value);
      }
    }
  }

  render() {
    return (
        <Host ref={(el) => (this.editorEl = el)} />
    );
  }
}
