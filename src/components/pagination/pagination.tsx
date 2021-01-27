import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Prop,
  h,
  Listen,
  Method,
  Watch,
  FunctionalComponent,
  State,
} from "@stencil/core";
import Debounce from "debounce-decorator";

@Component({
  tag: "fireenjin-pagination",
  styleUrl: "pagination.css",
})
export class Pagination implements ComponentInterface {
  virtualScrollEl: HTMLIonVirtualScrollElement;
  infiniteScrollEl: HTMLIonInfiniteScrollElement;

  @Event() fireenjinFetch: EventEmitter;

  @Prop() gridEl: FunctionalComponent<any>;
  @Prop() listEl: FunctionalComponent<any>;
  @Prop() disableFetch = false;
  @Prop({ mutable: true }) approxItemHeight: number;
  @Prop() endpoint?: string;
  @Prop() query?: string;
  @Prop() fetchData?: any;
  @Prop() limit?: number;
  @Prop() orderBy?: string;
  @Prop() orderDirection?: string;
  @Prop() dataPropsMap: any;
  @Prop() display: "list" | "grid" = "grid";
  @Prop({ mutable: true }) page? = 0;
  @Prop({ mutable: true }) results: any[] = [];
  @Prop() groupBy: string;
  @Prop() loadingSpinner = "bubbles";
  @Prop() loadingText = "Loading more data...";
  @Prop() resultsKey = "results";
  @Prop() pageKey: string;
  @Prop() pageCountKey: string;
  @Prop() resultCountKey: string;

  @State() paramData: {
    query?: string;
    limit?: number;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    whereEqual?: string;
    whereLessThan?: string;
    whereLessThanOrEqual?: string;
    whereGreaterThan?: string;
    whereGreaterThanOrEqual?: string;
    whereArrayContains?: string;
    whereArrayContainsAny?: string;
    whereIn?: string;
    next?: string;
    back?: string;
  } = {};

  @Debounce(1000)
  @Watch("query")
  onQuery() {
    this.results = [];
    this.getResults({
      page: 0,
    });
  }

  @Watch("orderBy")
  onOrderBy() {
    this.results = [];
    this.getResults({
      page: 0,
    });
  }

  @Watch("display")
  onDisplay() {
    setTimeout(async () => {
      window.dispatchEvent(new window.Event("resize"));
    }, 2000);
  }

  @Listen("fireenjinSuccess", { target: "body" })
  async onSuccess(event) {
    if (event.detail.name === "pagination") {
      try {
        if (this.page === 0) {
          this.results = [];
        }
        this.page = this.pageKey
          ? this.pageKey.split('.').reduce((o,i)=>o[i], event.detail.data)
          : this.page + 1;
        await this.addResults(this.resultsKey.split('.').reduce((o,i)=>o[i], event.detail.data));
      } catch (err) {
        console.log("Error updating results!");
      }

      await this.infiniteScrollEl.complete();
      await this.virtualScrollEl.checkEnd();
      if (!(this.resultsKey.split('.').reduce((o,i)=>o[i], event.detail.data).length) || (this.pageCountKey && this.pageKey && this.pageKey.split('.').reduce((o,i)=>o[i], event.detail.data) === this.pageCountKey.split('.').reduce((o,i)=>o[i], event.detail.data))) {
        this.infiniteScrollEl.disabled = true;
      }
      window.dispatchEvent(new window.Event("resize"));
    }
  }

  @Listen("ionInfinite")
  onInfiniteScroll() {
    this.getResults({
      next: true,
    });
  }

  @Listen("resize", { target: "window" })
  onResize() {
    if (
      this.display === "list" &&
      this.virtualScrollEl.querySelector("ion-item")
    ) {
      this.approxItemHeight = this.virtualScrollEl.querySelector(
        "ion-item"
      ).offsetHeight;
    } else if (
      this.display === "grid" &&
      this.virtualScrollEl.querySelectorAll("ion-col")
    ) {
      let i;
      let lastCol;
      const cols = this.virtualScrollEl.querySelectorAll("ion-col");
      for (i = 0; i < cols.length; i++) {
        const col = cols[i];
        if (lastCol && col.offsetTop !== lastCol.offsetTop) {
          break;
        }
        lastCol = col;
      }
      if (lastCol && lastCol.firstChild) {
        this.approxItemHeight = lastCol.firstChild.scrollHeight / i + 18;
      }
    }
  }

  @Method()
  async clearParamData(key?: string) {
    if (key && this.paramData[key]) {
      const paramData = this.paramData;
      delete paramData[key];
      this.paramData = paramData;
    } else if (!key) {
      this.paramData = {};
    }

    return this.paramData;
  }

  @Method()
  async addResults(results: any[] = []) {
    this.results = [...this.results, ...results];
  }

  @Method()
  async clearResults() {
    this.page = 0;
    this.results = [];
  }

  @Method()
  async getResults(
    options: {
      page?: number;
      next?: boolean;
      limit?: number;
      paramData?: any;
    } = {}
  ) {
    this.paramData = {
      ...this.paramData,
      limit: options.limit ? options.limit : this.limit,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      page: options.page ? options.page : this.page,
      ...(options?.paramData ? options.paramData : {}),
    };

    if (options.page) {
      this.page = options.page;
    }

    if (this.query?.length > 1) {
      this.paramData.query = this.query;
    }

    if (options.next && this.results?.length && this.results[this.results.length - 1]?.id) {
      this.paramData.next = this.results[this.results.length - 1].id;
    }

    this.fireenjinFetch.emit({
      name: "pagination",
      endpoint: this.endpoint,
      dataPropsMap: this.dataPropsMap ? this.dataPropsMap : null,
      disableFetch: this.disableFetch,
      params: {
        data: this.fetchData ? this.fetchData : this.paramData,
      },
    });
  }

  componentDidLoad() {
    this.getResults();
  }

  render() {
    return (
      <div class="pagination">
        <ion-virtual-scroll
          ref={(el) => (this.virtualScrollEl = el)}
          items={this.results}
          approxItemHeight={this.approxItemHeight}
        >
          {this.display === "grid" ? (
            <ion-grid>
              <ion-row>
                {this.results.map((result) => (
                  <ion-col>
                    {this.gridEl({ result }, null, null)}
                  </ion-col>
                ))}
              </ion-row>
            </ion-grid>
          ) : (
            <ion-card>
              <ion-list>
                {this.results.map((result) => this.listEl({ result }, null, null))}
              </ion-list>
            </ion-card>
          )}
        </ion-virtual-scroll>
        <ion-infinite-scroll
          style={{ display: "block" }}
          ref={(el) => (this.infiniteScrollEl = el)}
        >
          <ion-infinite-scroll-content
            loading-spinner={this.loadingSpinner}
            loading-text={this.loadingText}
          ></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
    );
  }
}
