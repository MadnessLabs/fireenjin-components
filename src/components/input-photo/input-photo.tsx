import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Method,
  Listen,
  Prop,
  State,
  Watch,
  h,
} from "@stencil/core";

@Component({
  tag: "fireenjin-input-photo",
  styleUrl: "input-photo.css",
})
export class InputPhoto implements ComponentInterface {
  @Element() photoUploaderEl: any;

  /**
   * Is the uploader disabled
   */
  @Prop() disabled = false;
  /**
   * A link to the photo to display
   */
  @Prop({
    mutable: true,
  })
  value: string;
  /**
   * The storage path to upload the file to
   */
  @Prop() path: string;
  /**
   * The fallback image to use if photo isn't set
   */
  @Prop() fallback: string;
  /**
   * The name to use when emitting field change event
   */
  @Prop() name?: string;
  /**
   * The filename to use for the uploaded file
   */
  @Prop() fileName?: string;
  /**
   * Should the photo uploader show the button
   */
  @Prop() showButton = false;
  /**
   * Text to display on the photo upload button
   */
  @Prop() buttonText = "Edit Image";
  /**
   * The type of photo being uploaded
   */
  @Prop() type = "photo";
  /**
   * The ID of the document the photo is tied to
   */
  @Prop() documentId: string;
  /**
   * The endpoint to upload to
   */
  @Prop() endpoint = "upload";
  @Prop() initials: string;
  /**
   * Allow uploading multiple
   */
  @Prop() multiple = false;

  @Prop({ mutable: true }) loading: boolean;
  @State() photoUrl: string;

  @Event() fireenjinUpload: EventEmitter;
  @Event() ionInput: EventEmitter;

  @Listen("fireenjinSuccess", { target: "body" })
  onSuccess(event) {
    if (event.detail.endpoint !== "upload" || event.detail.name !== this.name)
      return false;
    this.loading = false;
  }

  @Watch("value")
  onPhotoChange() {
    this.updatePhoto();
  }

  componentDidLoad() {
    this.updatePhoto();
  }

  updatePhoto() {
    this.photoUrl = this.value
      ? this.value
      : this.fallback
        ? this.fallback
        : null;
    if (this.value) {
      this.ionInput.emit({
        name: this.name,
        value: this.value,
      });
    }
  }

  @Method()
  async triggerFileInput(_event) {
    if (this.disabled) {
      return false;
    }
    const fileInputEl: any = this.photoUploaderEl.querySelector(
      'input[type="file"]'
    );
    fileInputEl.click();
  }

  selectFile(event) {
    for (const file of event?.target?.files || []) {
      this.uploadPhoto(file);
    }
  }

  uploadPhoto(file) {
    this.loading = true;
    if (!window.FileReader) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target.readyState != 2) return;
      if (event.target.error) {
        alert("Error while reading file");
        return;
      }

      this.fireenjinUpload.emit({
        event,
        endpoint: this.endpoint,
        name: this.name,
        data: {
          id: this.documentId,
          type: this.type,
          path: this.path,
          file,
          fileName: this.fileName,
          encodedContent: event.target.result,
        },
      });
    };

    reader.readAsDataURL(file);
  }

  onDrop(event) {
    event.preventDefault();
    this.uploadPhoto(event.dataTransfer.files[0]);
  }

  onDrag(event) {
    event.preventDefault();
  }

  onDragEnter() {
    this.showButton = true;
  }

  onDragLeave() {
    this.showButton = false;
  }

  render() {
    return (
      <div>
        <div class="upload-wrapper">
          <div
            class={this.loading ? "photo is-loading" : "photo"}
            style={{
              backgroundImage: this.photoUrl ? `url('${this.photoUrl}')` : null,
            }}
            onClick={(event) => this.triggerFileInput(event)}
            onDrop={(event) => this.onDrop(event)}
            onDragOver={(event) => this.onDrag(event)}
            onDragEnter={() => this.onDragEnter()}
            onDragLeave={() => this.onDragLeave()}
          >
            {!this.photoUrl && this.initials ? this.initials : null}
          </div>
          {this.showButton ? (
            <ion-button
              fill="clear"
              expand="block"
              size="small"
              onClick={(event) => this.triggerFileInput(event)}
            >
              {this.buttonText}
              <ion-icon name="image" slot="end" />
            </ion-button>
          ) : null}
        </div>
        <slot />
        <input
          type="file"
          onChange={(event) => this.selectFile(event)}
          accept="image/*"
          multiple={this.multiple}
        />
      </div>
    );
  }
}
