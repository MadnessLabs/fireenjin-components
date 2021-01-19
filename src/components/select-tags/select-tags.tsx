import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";
import Choices from "choices.js";

@Component({
  tag: "fireenjin-select-tags",
  styleUrl: "select-tags.css"
})
export class SelectTags implements ComponentInterface {
  choicesEl: any;
  itemEl: HTMLIonItemElement;
  inputEl: HTMLIonInputElement;

  @Event() fireenjinSelect: EventEmitter<{ event; options?: any; option?: any }>;

  @Prop() name = "tags";
  @Prop() label;
  @Prop() placeholder = "Select Tags";
  @Prop({ mutable: true }) value: any;
  @Prop() options: { label: string; value: any }[] = [];
  @Prop() required: boolean;
  @Prop() multiple: boolean;
  @Prop() duplicates = false;
  @Prop() info: string;

  @State() choices: any;
  @State() hasValue = false;

  @Listen("change")
  async onChange(event) {
    if (
      !event ||
      !event.detail ||
      !event.detail.value ||
      !this.options.length
    ) {
      return false;
    }

    if (this.multiple) {
      this.value = this.choices
        .getValue()
        .map(
          choice =>
            this.options.find(option => option.value === choice.value).value
        );
      this.fireenjinSelect.emit({
        event,
        options: this.choices
          .getValue()
          .map(choice =>
            this.options.find(option => option.value === choice.value)
          )
      });
    } else {
      this.value = event.detail.value;
      this.fireenjinSelect.emit({
        event,
        option: this.options.find(option => option.value === event.detail.value)
      });
    }
  }

  @Method()
  async setValue(value) {
    this.choices.setChoiceByValue(value);
  }

  @Method()
  async getChoices() {
    return this.choices;
  }

  @Watch("value")
  async onValueChange(newValue, oldValue) {
    if (!this.value || newValue === oldValue) return false;
    await this.setValue(this.value);
  }

  @Watch("options")
  async onOptionsChange(newValue, oldValue) {
    if (newValue === oldValue) return false;
    setTimeout(() => {
      this.setValue(this.value);
    }, 200);
  }

  componentDidLoad() {
    this.choices = new Choices(this.choicesEl, {
      placeholderValue: this.placeholder,
      duplicateItemsAllowed: this.duplicates,
      removeItemButton: this.multiple,
      callbackOnCreateTemplates: template => {
        return {
          input: (...args) =>
            Object.assign(
              Choices.defaults.templates.input.call(this, ...args),
              {
                placeholder: this.placeholder + " +"
              }
            ),
          item: (classNames, data) => {
            return template(`
                      <div class="${classNames.item} ${
              data.highlighted
                ? classNames.highlightedState
                : classNames.itemSelectable
            }" data-item data-deletable data-id="${data.id}" data-value="${
              data.value
            }" ${data.active ? 'aria-selected="true"' : ""} ${
              data.disabled ? 'aria-disabled="true"' : ""
            }>
                        <p class="choice-label-text">${data.label}</p>
                        ${
                          this.multiple
                            ? `<ion-icon name="close-circle" data-button />`
                            : ""
                        }
                      </div>
                    `);
          },
          choice: (classNames, data) => {
            return template(`
                      <div class="${classNames.item} ${classNames.itemChoice} ${
              data.disabled
                ? classNames.itemDisabled
                : classNames.itemSelectable
            }" data-choice ${
              data.disabled
                ? 'data-choice-disabled aria-disabled="true"'
                : "data-choice-selectable"
            } data-id="${data.id}" data-value="${data.value}" ${
              data.groupId > 0 ? 'role="treeitem"' : 'role="option"'
            }>
                        <p class="choice-label-text">${data.label}</p>
                      </div>
                    `);
          }
        };
      }
    } as any);
    if (!this.itemEl || !this.itemEl.shadowRoot) {
      return false;
    }
    (this.itemEl.shadowRoot.querySelector(
      ".input-wrapper"
    ) as HTMLElement).style.overflow = "visible";
  }

  render() {
    const OptionEl: any = "option";
    return (
      <ion-item
        ref={el => (this.itemEl = el)}
        lines="full"
        class={{
          "has-info-bubble": !!this.info
        }}
      >
        {this.label && (
          <ion-label position="stacked">
            <span>{this.label}</span>
            {this.info && <trackmygiving-info-button message={this.info} />}
          </ion-label>
        )}
        <select
          multiple={this.multiple}
          name={this.name}
          required={this.required}
          ref={el => (this.choicesEl = el)}
        >
          {!this.multiple && this.placeholder ? (
            <OptionEl placeholder>{this.placeholder}</OptionEl>
          ) : null}
          {this.options.map(option => (
            <option
              selected={
                this.multiple
                  ? this.value && this.value.indexOf(option.value) >= 0
                  : option.value + "" === this.value + ""
              }
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </ion-item>
    );
  }
}
