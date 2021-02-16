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
  Build,
} from "@stencil/core";
import Debounce from "debounce-decorator";

@Component({
  tag: "fireenjin-pagination",
  styleUrl: "pagination.css",
})
export class Pagination implements ComponentInterface {
  virtualScrollEl: HTMLIonVirtualScrollElement;
  infiniteScrollEl: HTMLIonInfiniteScrollElement;
  resizeInterval: NodeJS.Timeout;

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
  @Prop({
    mutable: true
  }) resultsKey: string;
  @Prop({
    mutable: true
  }) pageKey: string;
  @Prop({
    mutable: true
  }) pageCountKey: string;
  @Prop({
    mutable: true
  }) resultCountKey: string;
  @Prop({
    mutable: true
  }) name = "pagination";
  @Prop() collection: string;

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
    if (event.detail.name === this.name) {
      let results;
      try {
        results = this.resultsKey.split('.').reduce((o,i)=>o[i], event.detail.data);
      } catch (error) {
        console.log("Error getting results", event.detail, this.resultsKey);
      }
      try {
        if (this.page === 0) {
          this.results = [];
        }
        this.page = this.pageKey
          ? this.pageKey.split('.').reduce((o,i)=>o[i], event.detail.data)
          : this.page + 1;
        await this.addResults(results);
      } catch (err) {
        console.log("Error updating results!");
      }

      await this.infiniteScrollEl.complete();
      await this.virtualScrollEl.checkEnd();
      if (!results.length || (this.pageCountKey && this.pageKey && this.pageKey.split('.').reduce((o,i)=>o[i], event.detail.data) === this.pageCountKey.split('.').reduce((o,i)=>o[i], event.detail.data))) {
        this.infiniteScrollEl.disabled = true;
      }
      setTimeout(() => {
        window.dispatchEvent(new window.Event("resize"));
      }, 200);
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
      this.virtualScrollEl?.querySelector("ion-item")
    ) {
      this.approxItemHeight = this.virtualScrollEl.querySelector(
        "ion-item"
      ).offsetHeight;
    } else if (
      this.display === "grid" &&
      this.virtualScrollEl?.querySelectorAll("ion-col")
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
    if (options.page || options.page === 0) {
      this.page = options.page;
    }

    if (options.next) {
      this.page = this.page + 1;
    }

    this.paramData = {
      ...this.paramData,
      limit: options.limit ? options.limit : this.limit,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection,
      page: this.page,
      ...(options?.paramData ? options.paramData : {}),
    };

    if (this.query?.length > 1) {
      this.paramData.query = this.query;
    }

    if (options.next && this.results?.length && this.results[this.results.length - 1]?.id) {
      this.paramData.next = this.results[this.results.length - 1].id;
    }

    this.fireenjinFetch.emit({
      name: this.name,
      endpoint: this.endpoint,
      dataPropsMap: this.dataPropsMap ? this.dataPropsMap : null,
      disableFetch: this.disableFetch,
      params: {
        data: this.fetchData ? this.fetchData : this.paramData,
      },
    });
  }

  componentDidLoad() {
    if (this.collection) {
      this.resultsKey = !this.resultsKey ? `${this.collection}.results` : this.resultsKey;
      this.pageKey = !this.pageKey ? `${this.collection}.page` : this.pageKey;
      this.pageCountKey = !this.pageCountKey ? `${this.collection}.pageCount` : this.pageCountKey;
      this.resultCountKey = !this.resultCountKey ? `${this.collection}.resultCount` : this.resultCountKey;
      this.name = !this.name ? `${this.collection}Pagination` : this.name;
    }

    if (Build.isBrowser) {
      this.getResults();
      window.dispatchEvent(new window.Event("resize"));
      this.resizeInterval = setInterval(() => {
        window.dispatchEvent(new window.Event("resize"));
      }, 3000);
    }
    
  }

  disconnectedCallback() {
    if (Build.isBrowser) {
      clearInterval(this.resizeInterval);
    }
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
                {this.results.map((result) => typeof this.gridEl({ result }, null, null) === "string" ? (<ion-col innerHTML={this.gridEl({ result }, null, null) as any} />) : (
                  <ion-col>
                    {this.gridEl({ result }, null, null)}
                  </ion-col>
                ))}
              </ion-row>
            </ion-grid>
          ) : (
            <ion-card>
              <ion-list>
                {this.results.map((result) => typeof this.listEl({ result }, null, null) === "string" ? <div innerHTML={this.listEl({ result }, null, null) as any} /> : this.listEl({ result }, null, null))}
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
