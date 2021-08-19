import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  h,
} from "@stencil/core";
import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  ChartConfiguration,
  ChartDataset,
  PieController,
  TooltipLabelStyle,
  ChartTypeRegistry,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";

@Component({
  tag: "fireenjin-graph",
  styleUrl: "graph.css",
})
export class Graph implements ComponentInterface {
  chart: Chart;
  config: ChartConfiguration;

  @Element() graphEl: HTMLElement;

  /**
   * Emitted when a tooltip is shown over the graph
   */
  @Event() fireenjinGraphTooltip: EventEmitter<{
    event: {
      afterBody: any[];
      backgroundColor: string;
      beforeBody: any[];
      body: any[];
      bodyFontColor: string;
      bodyFontSize: number;
      bodySpacing: number;
      borderColor: string;
      borderWidth: number;
      caretPadding: number;
      caretSize: number;
      caretX: number;
      caretY: number;
      cornerRadius: number;
      dataPoints: any[];
      displayColors: boolean;
      footer: any[];
      footerFontColor: string;
      footerFontSize: number;
      footerMarginTop: number;
      footerSpacing: number;
      height: number;
      labelStyle: TooltipLabelStyle;
      labelTextColors: string[];
      legendBackgroundColor: string;
      opacity: number;
      title: string[];
      titleFontColor: string;
      titleFontSize: number;
      titleMarinBottom: number;
      titleSpacing: number;
      width: number;
      x: number;
      xAlign: number;
      xPadding: number;
      y: number;
      yAlign: number;
      yPadding: number;
    };
  }>;
  /**
   * Emitted when the graph is clicked
   */
  @Event() fireenjinGraphClick: EventEmitter<{ event; item?: any }>;

  /**
   * The dataset to render graph with
   */
  @Prop({
    mutable: true,
  })
  datasets: ChartDataset[] = [];
  /**
   * The labels for the graph
   */
  @Prop({
    mutable: true,
  })
  labels: string[] = [];
  /**
   * The title of the graph
   */
  @Prop() name: string;
  /**
   * The type of graph to generate
   */
  @Prop() type: keyof ChartTypeRegistry = "bar";

  /**
   * Set the list datasets for the graph
   * @param datasets The datasets to render
   */
  @Method()
  async setDatasets(datasets: ChartDataset[]) {
    return (this.datasets =
      typeof datasets === "string"
        ? JSON.parse(datasets)
        : datasets.length > 0
        ? datasets
        : this.graphEl.getAttribute("datasets")
        ? JSON.parse(this.graphEl.getAttribute("datasets"))
        : []);
  }

  /**
   * Set the list labels for the graph
   * @param labels The labels for the graph
   */
  @Method()
  async setLabels(labels: string[]) {
    return (this.labels =
      typeof labels === "string"
        ? JSON.parse(labels)
        : labels.length > 0
        ? labels
        : this.graphEl.getAttribute("labels")
        ? JSON.parse(this.graphEl.getAttribute("labels"))
        : []);
  }

  /**
   * Refresh the graph
   */
  @Method()
  async refresh() {
    try {
      setTimeout(async () => {
        const chartCanvas = this.graphEl.querySelector("canvas");
        if (chartCanvas) {
          if (this.chart) {
            await this.removeChart();
          }
        }
        this.configureGraph();
        this.chart = new Chart(chartCanvas, { ...this.config });
      }, 200);
    } catch (error) {
      console.log("Error loading graph...", error);
    }
  }

  /**
   * Destroy the ChartJS instance and reset chart on state
   */
  @Method()
  async removeChart() {
    this.chart.destroy();
    this.chart = null;
    delete this.chart;

    return true;
  }

  onGraphClick(event, item) {
    this.fireenjinGraphClick.emit({ event, item });
  }

  configureGraph() {
    this.config = {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {},
    };
    if (!this.config.options) {
      this.config.options = {};
    }
    // if (!this.config.options.tooltips) {
    //   this.config.options.tooltips = {
    //     enabled: false,
    //     custom: (event) => {
    //       this.fireenjinGraphTooltip.emit({ event: event as any });
    //     },
    //   };
    // }

    if (!this.config.options.onClick) {
      this.config.options.onClick = this.onGraphClick.bind(this);
    }
  }

  componentDidLoad() {
    Chart.register(
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      PieController,
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Title
    );
  }

  render() {
    this.refresh();

    return (
      <div id="graph-wrapper">
        <canvas />
      </div>
    );
  }
}
