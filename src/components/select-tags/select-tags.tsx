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
  h,
} from "@stencil/core";
import Choices from "choices.js";

@Component({
  tag: "fireenjin-select-tags",
  styleUrl: "select-tags.css",
})
export class SelectTags implements ComponentInterface {
  choicesEl: any;
  itemEl: HTMLIonItemElement;
  inputEl: HTMLIonInputElement;

  @Event() fireenjinSelect: EventEmitter<{
    event;
    options?: any;
    option?: any;
  }>;

  @Prop() name = "tags";
  @Prop() label;
  @Prop() placeholder = "Select Tags";
  @Prop({ mutable: true }) value: any;
  @Prop() options: { label: string; value: any }[] = [];
  @Prop() required: boolean;
  @Prop() multiple: boolean;
  @Prop() duplicates = false;
  @Prop() disabled = false;
  @Prop() allowAdding = false;

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
      try {
        this.value = this.choices.getValue().map((choice) => 
          this.options.find((option) => option.value === choice.value).value
        );

        this.fireenjinSelect.emit({
          event,
          options: this.choices
            .getValue()
            .map((choice) =>
              this.options.find((option) => option.value === choice.value)
            ),
        });
      } catch (error) {
        console.log("Error setting value");
      }
    } else {
      this.value = event.detail.value;
      this.fireenjinSelect.emit({
        event,
        option: this.options.find(
          (option) => option.value === event.detail.value
        ),
      });
    }
  }

  @Listen("keydown")
  async onKeyDown(event: any) {
    if (event.key === "Enter" && this.allowAdding) {
      const value = event.target.value.toLocaleLowerCase();
      this.value = [...(this.value ? this.value : []), value];
      await this.choices.setChoices([...this.options, {
        label: event.target.value,
        value
      }]);
      setTimeout(() => {
        this.setValue(value);
      }, 200);
    }
  }

  @Method()
  async setValue(value) {
    try {
      this.choices.setChoiceByValue(value);
    } catch (error) {
      console.log("Error setting value...");
    }
  }

  @Method()
  async getChoices() {
    return this.choices;
  }

  @Watch("value")
  async onValueChange(newValue, oldValue) {
    if (!this.value || newValue === oldValue || !this.choices) return false;
    await this.setValue(this.value);
  }

  @Watch("options")
  async onOptionsChange(newValue, oldValue) {
    if (newValue === oldValue || !this.choices) return false;
    await this.choices.setChoices(newValue);
    setTimeout(() => {
      this.setValue(this.value);
    }, 200);
  }

  initChoices() {
    try {
      this.choices = new Choices(this.choicesEl, {
        placeholderValue: this.placeholder,
        duplicateItemsAllowed: this.duplicates,
        removeItemButton: this.multiple,
        callbackOnCreateTemplates: (template) => {
          return {
            input: (...args) => {
              return Object.assign(
                Choices.defaults.templates.input.call(this, ...args),
                {
                  placeholder: this.placeholder + " +",
                }
              );
            },
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
            },
          };
        },
      } as any);
    } catch (error) {
      console.log("Error initializing choices...");
    }
  }

  componentDidLoad() {
    this.initChoices();

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
      <ion-item ref={(el) => (this.itemEl = el)} lines="full">
        {this.label && <ion-label position="stacked">{this.label}</ion-label>}
        <select
          disabled={this.disabled}
          multiple={this.multiple}
          name={this.name}
          required={this.required}
          ref={(el) => (this.choicesEl = el)}
        >
          <slot />
          {!this.multiple && this.placeholder ? (
            <OptionEl placeholder>{this.placeholder}</OptionEl>
          ) : null}
          {this.options.map((option) => (
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
