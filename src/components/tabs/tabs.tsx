import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Prop,
  State,
  h,
  Build,
} from "@stencil/core";

@Component({
  tag: "fireenjin-tabs",
  styleUrl: "tabs.css",
})
export class Tabs implements ComponentInterface {
  tabsWrapperEl: HTMLElement;

  @Event() fireenjinTabChange: EventEmitter;

  @Prop() hash: boolean;
  @Prop({ mutable: true }) selected: string;

  @State() tabs: any[] = [];

  componentDidLoad() {
    if (Build.isBrowser) {
      this.tabs = this.setSelectedTab();

      if (this.hash) {
        window.onhashchange = () => {
          const tabs: any = this.tabsWrapperEl.querySelectorAll(
            "fireenjin-tab"
          );
          this.tabs = this.setSelectedTab();
          for (let i = 0; i < tabs.length; ++i) {
            tabs[i].selected = this.selected === tabs[i].tab;
          }
        };
      }
    }
  }

  setSelectedTab() {
    const tabs: any = this.tabsWrapperEl.querySelectorAll("fireenjin-tab");
    const newTabs = [];
    for (let i = 0; i < tabs.length; ++i) {
      if (tabs[i].selected && (window.location.hash === "" || !this.hash)) {
        this.selected = tabs[i].tab;
      } else if (
        this.hash &&
        window.location.hash === "#" + tabs[i].tab.toLowerCase()
      ) {
        this.selected = tabs[i].tab;
      }
      newTabs.push({ name: tabs[i].tab });
    }

    return newTabs;
  }

  tabClick(tab) {
    const tabs: any = this.tabsWrapperEl.querySelectorAll("fireenjin-tab");
    this.selected = tab.name;
    for (let i = 0; i < tabs.length; ++i) {
      tabs[i].selected = this.selected === tabs[i].tab;
    }
    if (this.hash) {
      window.location.hash = `#${tab.name}`;
    }
    this.fireenjinTabChange.emit({ tab });
  }

  render() {
    return (
      <div ref={(el) => (this.tabsWrapperEl = el)} class="tabs-wrapper">
        <ion-grid class="tabs-bar">
          <ion-row>
            {this.tabs.map((tab) => (
              <ion-col
                class={this.selected === tab.name ? "selected" : ""}
                onClick={() => this.tabClick(tab)}
              >
                {tab.name}
              </ion-col>
            ))}
          </ion-row>
        </ion-grid>
        <div class="tabs-content">
          <slot />
        </div>
      </div>
    );
  }
}
