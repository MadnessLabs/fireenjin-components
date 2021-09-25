import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { filterControl } from "../../typings";

@Component({
  tag: "fireenjin-search-bar",
  styleUrl: "search-bar.css",
})
export class SearchBar implements ComponentInterface {
  @Event() fireenjinTrigger: EventEmitter;
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
  @Prop({ mutable: true }) filter?: {
    label?: string;
    controls: filterControl[];
  };
  @Prop() paginationEl: any;
  @Prop() modeToggle = false;
  @Prop({
    mutable: true,
  })
  displayMode: "list" | "grid" = "grid";
  @Prop() disabled = false;
  @Prop() beforeGetResults: any;
  @Prop({
    mutable: true
  })
  showFilter = true;

  @State() selectOptions: any = {};
  @State() currentFilters: {
    [filterKey: string]: filterControl;
  } = {};

  @Watch("filter")
  onFilterChange() {
    this.updateCurrentFilters();
  }

  @Listen("fireenjinTrigger", { target: "body" })
  async onTrigger(event) {
    if (event?.detail?.trigger === "set" && event?.detail?.payload?.name) {
      for (const [i, control] of this.filter.controls.entries()) {
        if (!control?.name || event?.detail?.payload?.name !== control?.name) continue;
        const controlData = {
          ...control,
          value: event?.detail?.payload?.value || null
        };
        this.filter.controls[i] = controlData;
        this.currentFilters[control.name] = controlData;
        this.filter = { ...this.filter };
      }
      if (!this.paginationEl) return;
      await this.paginationEl.clearResults();
      await this.paginationEl.getResults();
    }
  }

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event?.detail?.name !== "select") return;
    this.selectOptions[event.detail.target.name] = event.detail.data.results;
  }

  @Listen("ionChange")
  async onChange(event) {
    if (event?.target?.name === "orderBy") {
      this.paginationEl.orderBy = event.detail.value;
    }
    if (event?.target?.tagName === "ION-SEARCHBAR") {
      await this.paginationEl.clearParamData("next");
      await this.paginationEl.clearParamData("back");
      await this.paginationEl.clearParamData("page");
      this.paginationEl.query = event.detail.value ? event.detail.value : "";
    }
  }

  @Method()
  async togglePaginationDisplay() {
    this.displayMode = this.displayMode === "grid" ? "list" : "grid";
    this.paginationEl.display = this.displayMode;
  }

  @Method()
  async clearFilter(
    event,
    clearingControl: filterControl
  ) {
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
      await new Promise(async (resolve, reject) => {
        try {
          const paramData = {};
          for (const filter of Object.values(this.currentFilters)) {
            paramData[filter.name] = filter.value;
          }
          let fetchData = { paramData };
          if (
            this.beforeGetResults &&
            typeof this.beforeGetResults === "function"
          )
            fetchData = await this.beforeGetResults(fetchData);
          resolve(fetchData);
        } catch (err) {
          console.log(err);
          reject({});
        }
      })
    );
  }

  @Method()
  async updateCurrentFilters() {
    if (!this.filter?.controls) return;
    for (const control of this.filter.controls) {
      if (!control?.value) continue;
      this.currentFilters[control.name] = control;
      this.currentFilters = { ...this.currentFilters };
    }
  }

  getLabelForValue(control: filterControl, value: any) {
    for (const option of control?.options || []) {
      if (option?.value !== value) continue;
      return option?.label ? option.label : option.value;
    }
  }

  getControlLabel(control: filterControl) {
    const value = control?.value ? control.value : null;
    let label = value ? Array.isArray(value) ? value.map(val => this.getLabelForValue(control, val)).join(", ") : this.getLabelForValue(control, value) : control.label;

    return label;
  }

  componentDidLoad() {
    this.updateCurrentFilters();
  }

  render() {
    return (
      <Host>
        <div class="search-bar-wrapper">
          <ion-searchbar
            disabled={this.disabled}
          />
          {this.showFilter && this.filter?.controls?.length && <div class="filter-bar">
            {this.filter?.controls?.length && this.filter?.controls.map(control => (<ion-chip outline={!Object.keys(this.currentFilters).includes(control?.name)} onClick={(event) => this.fireenjinTrigger.emit({
              event,
              trigger: "filter",
              name: control?.name,
              payload: {
                control
              }
            })}>
              {control?.icon && <ion-icon name={control.icon}></ion-icon>}
              {control?.label && <ion-label>{this.getControlLabel(control)}</ion-label>}
              {Object.keys(this.currentFilters).includes(control?.name) && <ion-icon name="close-circle" onClick={(event) => this.clearFilter(event, control)} />}
            </ion-chip>))}
          </div>}
        </div>
        {this.filter?.controls?.length && <ion-button onClick={() => this.showFilter = !this.showFilter} class="filter-button" size="small" fill="clear" shape="round" style={{ color: "var(--ion-text-color)" }}>
          <ion-icon name="funnel" slot="icon-only" />
          {Object.keys(this.currentFilters)?.length && <ion-badge slot="end">{this.currentFilters ? Object.keys(this.currentFilters).length : 0}</ion-badge>}
        </ion-button>}
      </Host>
    );
  }
}
