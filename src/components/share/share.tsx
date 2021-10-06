import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  Prop,
  h,
  Build,
} from "@stencil/core";
import ClipboardJS from "clipboard";

@Component({
  tag: "fireenjin-share",
  styleUrl: "share.css",
})
export class Share implements ComponentInterface {
  copyItemEl: any;

  @Event() fireenjinShareClose: EventEmitter;

  @Prop() facebookAppId: string;
  @Prop() url: string;
  @Prop() text: string;
  @Prop() subject: string;
  @Prop() lines: "full" | "inset" | "none";

  // Implementation Example
  // import { SocialSharing } from "@ionic-native/social-sharing";
  //
  // @Listen("fireenjinShare")
  // async share(event) {
  //   try {
  //     if (navigator?.share) {
  //       await navigator.share(event.detail.data);

  //       return;
  //     }

  //     if (!navigator?.share) {
  //       this.sharePopover = await popoverController.create({
  //         event: event.detail.event,
  //         component: "fireenjin-share",
  //         componentProps: event.detail.data,
  //       });
  //       this.sharePopover.present();
  //       return;
  //     }

  //     await SocialSharing.share(
  //       event.detail.data.message,
  //       event.detail.data.subject,
  //       event.detail.data.file,
  //       event.detail.data.url
  //     );
  //   } catch (e) {
  //     console.log("Error using share functionality...", e);
  //   }
  // }

  openPopup(event, type: string) {
    event.preventDefault();
    let popupUrl;
    if (type === "facebook") {
      popupUrl = `https://www.facebook.com/dialog/share?app_id=${this.facebookAppId}&display=popup&href=${this.url}`;
    } else if (type === "google") {
      popupUrl = `https://plus.google.com/share?url=${this.url}`;
    } else if (type === "twitter") {
      popupUrl = `https://twitter.com/intent/tweet?url=${this.url}&text=${this.text}`;
    } else {
      return false;
    }

    this.fireenjinShareClose.emit({ event, type });

    window.open(
      popupUrl,
      "Share",
      type === "google" ? "height=600,width=400" : "height=400,width=600"
    );
  }

  componentDidLoad() {
    if (Build.isBrowser) {
      new ClipboardJS(this.copyItemEl);
    }
  }

  render() {
    return (
      <ion-list>
        <ion-item
          lines={this.lines}
          class="share-twitter"
          onClick={(event) => this.openPopup(event, "twitter")}
        >
          <ion-icon slot="end" name="logo-twitter" />
          Share on Twitter
        </ion-item>
        <ion-item
          lines={this.lines}
          class="share-facebook"
          onClick={(event) => this.openPopup(event, "facebook")}
        >
          <ion-icon slot="end" name="logo-facebook" />
          Share on Facebook
        </ion-item>
        <ion-item
          lines={this.lines}
          ref={(el) => (this.copyItemEl = el)}
          class="share-clipboard"
          data-clipboard-text={this.url}
        >
          <ion-icon slot="end" name="clipboard" />
          Copy to Clipboard
        </ion-item>
      </ion-list>
    );
  }
}
