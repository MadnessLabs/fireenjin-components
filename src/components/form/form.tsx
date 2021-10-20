import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  h,
} from "@stencil/core";

@Component({
  tag: "fireenjin-form",
  styleUrl: "form.css",
})
export class Form implements ComponentInterface {
  formEl: HTMLFormElement;
  submitButtonEl: HTMLIonButtonElement;
  resetButtonEl: HTMLIonButtonElement;
  componentIsLoaded = false;

  @Element() fireenjinFormEl;

  /**
   * The name of the form used for ID and name
   */
  @Prop() name: string;
  /**
   * The data from the form being filled out
   */
  @Prop({ mutable: true }) formData: any = {};
  /**
   * What the save button says
   */
  @Prop() submitButton = "Save";
  /**
   * What color the submit button is
   */
  @Prop() submitButtonColor = "primary";
  /**
   * What fill option to use for the submit button
   */
  @Prop() submitButtonFill: "clear" | "outline" | "solid" | "default" = "solid";
  /**
   * What the reset button says
   */
  @Prop() resetButton = "Cancel";
  /**
   * What color the reset button is
   */
  @Prop() resetButtonColor = "dark";
  /**
   * What fill option to use for the reset button
   */
  @Prop() resetButtonFill: "clear" | "outline" | "solid" | "default" = "clear";
  /**
   * Should the form controls be hidden?
   */
  @Prop() hideControls = false;
  /**
   * The endpoint that form submission should link to
   */
  @Prop() endpoint: string;
  /**
   * The endpoint to get data to fill the form
   */
  @Prop() findEndpoint: string;
  /**
   * The id of the document being edited
   */
  @Prop() documentId: string;
  /**
   * The data to exclude from the form submit event
   */
  @Prop() excludeData: string[] = [];
  /**
   * A method that runs before form submission to allow editing of formData
   */
  @Prop() beforeSubmit: (data: any, options?: any) => Promise<any>;
  /**
   * Should the form disable the loader on submit
   */
  @Prop() disableLoader = false;
  /**
   * Is the component currently loading
   */
  @Prop({ mutable: true }) loading = false;
  /**
   * Should the enter button binding be disabled
   */
  @Prop() disableEnterButton = false;
  /**
   * Should the form disable reset
   */
  @Prop() disableReset = false;
  /**
   * Confirm leaving the page when the form is filled
   */
  @Prop() confirmExit = false;
  /**
   * Has the form fields been changed
   */
  @Prop({
    mutable: true,
  })
  hasChanged = false;
  /**
   * The form params
   */
  @Prop() findParams: any;
  /**
   * The data map to find
   */
  @Prop() findDataMap: any;
  /**
   * The HTTP method to use when submitting the form
   */
  @Prop() method: string = "post";
  /**
   * The action to use for the form
   */
  @Prop() action: string;
  @Prop() apiUrl: string;

  /**
   * Emitted on load with endpoint
   */
  @Event() fireenjinFetch: EventEmitter<{
    event?;
    endpoint: string;
    params?: any;
    name?: string;
  }>;
  /**
   * Emitted when the user resets the form
   */
  @Event() fireenjinReset: EventEmitter<{
    event;
    id: string;
    endpoint: string;
    data: any;
    name: string;
  }>;
  /**
   * Emitted when the user submits the form
   */
  @Event() fireenjinSubmit: EventEmitter<{
    event;
    id: string;
    endpoint: string;
    data: any;
    name: string;
  }>;
  /**
   * Emitted when a filed checks validation
   */
  @Event() fireenjinValidation: EventEmitter<{
    event;
    isValid: boolean;
    name: string;
  }>;

  @Listen("ionInput")
  @Listen("ionChange")
  onInput(event) {
    if (
      event &&
      event.target &&
      event.target.name &&
      !event.target.name.startsWith("ion-") &&
      (this.excludeData ? this.excludeData : []).filter(
        (excludedName) => excludedName === event.target.name
      ).length === 0
    ) {
      this.setByPath(this.formData, event.target.name, event.target.value);
      if (this.componentIsLoaded && !this.hasChanged) {
        this.hasChanged = true;
      }
    }
  }

  @Listen("ionSelect")
  onSelect(event) {
    if (
      event &&
      event.target &&
      event.target.name &&
      (this.excludeData ? this.excludeData : []).filter(
        (excludedName) => excludedName === event.target.name
      ).length === 0
    ) {
      this.formData[event.target.name] = event.target.value;
      if (this.componentIsLoaded && !this.hasChanged) {
        this.hasChanged = true;
      }
    }
  }

  @Listen("keydown")
  async onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && (await this.checkFormValidity())) {
      if (this.submitButtonEl && !this.disableEnterButton) {
        this.submitButtonEl.click();
      }
    }
  }

  @Listen("fireenjinSuccess", { target: "body" })
  async onSuccess(event) {
    if (event.detail.target === this.fireenjinFormEl && this.findDataMap) {
      this.formData = await this.mapFormData(
        this.findDataMap,
        event.detail?.data ? event.detail.data : {}
      );
      await this.setFormData(this.formData);
    }
  }

  @Method()
  async setLoading(value: boolean) {
    this.loading = !!value;
  }

  /**
   * Emit fireenjinSubmit event with form data
   * @param event The form submit event
   */
  @Method()
  async submit(event?, options = {
    manual: false
  }) {
    if (event) event.preventDefault();
    await this.checkFormValidity();
    this.loading = !this.disableLoader;
    const data =
      this.beforeSubmit && typeof this.beforeSubmit === "function"
        ? await this.beforeSubmit(this.formData, options)
        : this.formData;
    this.fireenjinSubmit.emit({
      event,
      id: this.documentId,
      endpoint: this.endpoint,
      data,
      name: this.name,
    });
    this.hasChanged = false;
  }

  /**
   * Emit fireenjinReset event with form data
   * @param event The form reset event
   */
  @Method()
  async reset(event?) {
    if (!event) {
      this.formEl.reset();
      return false;
    }
    if (this.disableReset) {
      event.preventDefault();
    } else {
      this.formData = {};
      this.hasChanged = false;
    }
    this.fireenjinReset.emit({
      event,
      id: this.documentId,
      endpoint: this.endpoint,
      data: this.formData,
      name: this.name,
    });
  }

  @Method()
  async checkFormValidity(reportValidity = true) {
    let isValid = true;
    const inputEls = [].slice.call(
      this.formEl.querySelectorAll("fireenjin-input")
    );
    for (const inputEl of inputEls) {
      if (
        !(await inputEl.checkValidity(
          !reportValidity
            ? {
              validationClassOptions: {
                ignoreInvalid: true,
              },
            }
            : null
        ))
      ) {
        if (isValid && reportValidity) {
          await inputEl.reportValidity();
        }
        isValid = false;
      }
    }

    return isValid;
  }

  @Method()
  async reportFormValidity() {
    const isValid = await this.checkFormValidity(false);
    this.fireenjinValidation.emit({
      event,
      isValid,
      name: this.name,
    });

    if (this.submitButtonEl) {
      this.submitButtonEl.disabled = !isValid;
    }
  }

  @Method()
  async setFormData(data: any) {
    const fields = this.formEl.querySelectorAll("[data-fill]");
    fields.forEach((field: HTMLInputElement) => {
      const dataKey =
        field.dataset?.fill?.length > 0 ? field.dataset.fill : field.name;
      field.value = this.getByPath(data, dataKey);
    });
    this.formData = data;
  }

  async mapFormData(dataMap, data) {
    let newData = data ? data : {};
    if (dataMap) {
      const dataKeys = Object.keys(dataMap);
      for (const key of dataKeys) {
        if (dataMap[key]) {
          newData[dataMap[key]] = data[key];
        } else {
          newData = { ...newData, ...data[key] };
        }
      }
    }

    return newData;
  }

  getByPath(o, s) {
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    var a = s.split(".");
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }

  setByPath(obj, path, value) {
    const pList = path.split(".");
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      const elem = pList[i];
      if (!obj[elem]) obj[elem] = {};
      obj = obj[elem];
    }

    obj[pList[len - 1]] = value;
  }

  componentDidLoad() {
    setTimeout(() => {
      this.componentIsLoaded = true;
    }, 2000);
    if (this.findEndpoint && this.documentId) {
      this.fireenjinFetch.emit({
        endpoint: this.findEndpoint,
        params: {
          ...(this.findParams ? this.findParams : {}),
          id: this.documentId,
        },
      });
    }
    if (this.formData) {
      this.setFormData(this.formData);
    }
  }

  render() {
    return (
      <form
        ref={(el) => (this.formEl = el as HTMLFormElement)}
        name={this.name}
        id={this.name}
        action={this.action ? this.action : `${this.apiUrl ? this.apiUrl : "http://localhost:4000"}/${this.endpoint}`}
        method={this.method}
        onReset={(event) => this.reset(event)}
        onSubmit={(event) => this.submit(event)}
        class={{ "is-loading": this.loading }}
      >
        <slot />
        {!this.hideControls && (
          <ion-grid class="form-controls">
            <ion-row>
              <ion-col>
                {this.resetButton ? (
                  <ion-button
                    ref={(el) => (this.resetButtonEl = el)}
                    type="reset"
                    fill={this.resetButtonFill}
                    color={this.resetButtonColor}
                    innerHTML={this.resetButton}
                  ></ion-button>
                ) : null}
              </ion-col>
              <ion-col>
                {this.submitButton ? (
                  <ion-button
                    ref={(el) => (this.submitButtonEl = el)}
                    type="submit"
                    color={this.submitButtonColor}
                    fill={this.submitButtonFill}
                    innerHTML={this.submitButton}
                  />
                ) : null}
              </ion-col>
            </ion-row>
          </ion-grid>
        )}
      </form>
    );
  }
}
