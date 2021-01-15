import { popoverController } from "@ionic/core";
import {
  Component,
  ComponentInterface,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { Control } from "../renderer";

@Component({
  tag: "fireenjin-filter-bar",
  styleUrl: "filter-bar.css",
})
export class FilterBar implements ComponentInterface {
  filterPopoverEl: HTMLIonPopoverElement;
  @Prop() sort?: {
    label?: string;
    value?: string;
    header?: string;
    subHeader?: string;
    message?: string;
    options: {
      label: string;
      value: string;
    }[];
  };
  @Prop() filter?: {
    label?: string;
    controls: Control[];
  };

  @Prop() paginationEl: any;
  @Prop() modeToggle = false;

  @State() displayMode: "list" | "grid" = "grid";
  @State() selectOptions: any = {};
  @State() currentFilters: {
    [filterKey: string]: Control;
  } = {};

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event?.detail?.name !== "select") return;
    this.selectOptions[event.detail.target.name] = event.detail.data.results;
  }

  @Listen("fireenjinReset", { target: "body" })
  onReset() {
    if (!this.filterPopoverEl) return;
    this.filterPopoverEl.dismiss();
  }

  @Listen("fireenjinSubmit", { target: "body" })
  async onSubmit(event) {
    if (!this.filterPopoverEl || event?.detail?.name !== "filter") return;
    if (event.detail?.data && Object.keys(event.detail.data).length) {
      for (const [i, control] of this.filter.controls.entries()) {
        if (!control.name || !event.detail?.data[control.name]) continue;
        const controlData = {
          ...control,
          value: event.detail.data[control.name],
        };
        this.filter.controls[i] = controlData;
        this.currentFilters[control.name] = controlData;
        this.filter = { ...this.filter };
      }
    }
    await this.paginationEl.clearResults();
    this.paginationEl.getResults({
      paramData: event?.detail?.data ? event.detail.data : {},
    });
    this.filterPopoverEl.dismiss();
  }

  @Listen("ionChange", { target: "body" })
  onChange(event) {
    if (event?.target?.name === "orderBy") {
      this.paginationEl.orderBy = event.detail.value;
    }
    if (event?.target?.tagName === "ION-SEARCHBAR") {
      this.paginationEl.query = event.detail.value;
    }
  }

  @Method()
  async togglePaginationDisplay() {
    this.displayMode = this.displayMode === "grid" ? "list" : "grid";
    this.paginationEl.display = this.displayMode;
  }

  @Method()
  async openFilterPopover(event) {
    this.filterPopoverEl = await popoverController.create({
      component: "fireenjin-popover-filter",
      componentProps: this.filter,
      event,
      cssClass: "fireenjin-popover-filter-wrapper",
    });
    this.filterPopoverEl.present();
  }

  @Method()
  async clearFilter(event, clearingControl: Control) {
    event.preventDefault();
    event.stopPropagation();
    for (const [i, control] of this.filter.controls.entries()) {
      if (
        !control.name ||
        !control.value ||
        control.name !== clearingControl.name
      )
        continue;
      this.filter.controls[i] = {
        ...control,
        value: null,
      };
      delete this.currentFilters[clearingControl.name];
      this.filter = { ...this.filter };
      await this.paginationEl.clearParamData(control.name);
    }
    await this.paginationEl.clearResults();
    await this.paginationEl.getResults(
      await new Promise((resolve, reject) => {
        try {
          const paramData = {};
          for (const filter of Object.values(this.currentFilters)) {
            paramData[filter.name] = filter.value;
          }
          console.log(paramData);
          resolve(paramData);
        } catch (err) {
          console.log(err);
          reject({});
        }
      })
    );
  }

  render() {
    return (
      <Host>
        <slot name="before" />
        <ion-grid>
          <ion-row>
            {this.modeToggle && (
              <ion-col class="mode-toggle">
                <ion-button
                  fill="clear"
                  color="primary"
                  onClick={() => this.togglePaginationDisplay()}
                >
                  <ion-icon
                    slot="icon-only"
                    name={this.displayMode === "grid" ? "list" : "grid"}
                  />
                </ion-button>
              </ion-col>
            )}
            <ion-col>
              <ion-searchbar />
            </ion-col>
            {this.filter?.controls?.length && (
              <ion-col class="filter-control">
                <ion-card
                  onClick={(event) => this.openFilterPopover(event)}
                  class={{
                    "has-value":
                      this.currentFilters &&
                      Object.keys(this.currentFilters).length > 0,
                  }}
                >
                  <ion-icon name="funnel" class="start-icon" />
                  {this.filter?.controls?.length
                    ? this.filter.controls
                        .filter(
                          (control) =>
                            !!control.value &&
                            (control.options?.length ||
                              this.selectOptions[control.name])
                        )
                        .map((control) => (
                          <ion-chip
                            outline
                            color="primary"
                            style={{
                              marginTop: "0",
                              marginBottom: "0",
                            }}
                          >
                            {control.icon && <ion-icon name={control.icon} />}
                            <ion-label>
                              {control.options?.length
                                ? control.options
                                    .filter(
                                      (option) => control.value.map ? control.value.includes(option.value) : option.value === control.value
                                    )
                                    .map((option) => option.label).join(", ")
                                : this.selectOptions[control.name]
                                ? this.selectOptions[control.name]
                                    .filter(
                                      (result) => control.value.map ? control.value.includes(result.id) : result.id === control.value
                                    )
                                    .map((result) => result.name).join(", ")
                                : null}
                            </ion-label>
                            <ion-icon
                              name="close-circle"
                              onClick={(event) =>
                                this.clearFilter(event, control)
                              }
                            ></ion-icon>
                          </ion-chip>
                        ))
                    : null}
                  {this.filter?.label &&
                  !(
                    this.currentFilters &&
                    Object.keys(this.currentFilters).length > 0
                  )
                    ? this.filter.label
                    : ""}
                  <ion-icon name="caret-down" class="end-icon" />
                </ion-card>
              </ion-col>
            )}
            {this.sort?.options?.length && (
              <ion-col>
                <ion-card>
                  <ion-icon
                    style={{
                      height: "25px",
                      width: "25px",
                      padding: "5px 0px 0px 5px",
                    }}
                    class="ion-float-left"
                    name="swap-vertical"
                  />
                  <ion-select
                    name="orderBy"
                    value={this.sort.value}
                    okText="Okay"
                    cancelText="Dismiss"
                    interfaceOptions={{
                      header: this.sort.header,
                      subHeader: this.sort.subHeader,
                      message: this.sort.message,
                    }}
                  >
                    {this.sort.options.map((option) => (
                      <ion-select-option value={option.value}>
                        {option.label}
                      </ion-select-option>
                    ))}
                  </ion-select>
                </ion-card>
              </ion-col>
            )}
          </ion-row>
        </ion-grid>
        <slot name="after" />
      </Host>
    );
  }
}
