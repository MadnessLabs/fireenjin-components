import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  Prop,
  State,
  h,
  Watch,
  Method,
} from "@stencil/core";

@Component({
  tag: "fireenjin-input-file",
  styleUrl: "input-file.css",
})
export class InputFile implements ComponentInterface {
  @Element() fileUploaderEl: any;

  @Prop() path: string;
  @Prop() icon: string;
  @Prop() label: string;
  @Prop() fileName: string;
  @Prop() name?: string;
  @Prop() accept?: string;
  @Prop() defaultValue: any;
  @Prop() value: any;
  @Prop() type = "file";
  @Prop() documentId: string;
  /**
   * The endpoint to upload to
   */
  @Prop() endpoint = "upload";
  @Prop() uploadData: any = {};

  @State() isLoading: boolean;
  @State() fileUrl: string;
  @State() selectedFile: string;
  @State() dragOver = false;

  @Event() fireenjinUpload: EventEmitter;
  @Event() ionInput: EventEmitter;

  @Watch("value")
  onFileChange() {
    if (!this.value) return false;
    this.ionInput.emit({
      name: this.name,
      value: this.value,
    });
  }

  @Method()
  async openFile() {
    const fileInputEl: any =
      this.fileUploaderEl.querySelector('input[type="file"]');
    fileInputEl.click();
    return fileInputEl;
  }

  uploadFile(file) {
    this.isLoading = true;
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
        name: this.name,
        endpoint: this.endpoint,
        data: {
          ...{
            id: this.documentId,
            type: this.type,
            fileName: this.fileName,
            file,
            path: this.path,
            encodedContent: event.target.result,
          },
          ...this.uploadData,
        },
      });
    };

    reader.readAsDataURL(file);
  }

  selectFile(event) {
    this.isLoading = true;
    const file = event.target.files[0];
    this.selectedFile = file.name;
    this.uploadFile(file);
  }

  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === "file") {
          var file = event.dataTransfer.items[i].getAsFile();
          this.selectedFile = file.name;
          this.uploadFile(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i];
        this.selectedFile = file.name;
        this.uploadFile(file);
        console.log("... file[" + i + "].name = " + file.name);
      }
    }
    this.dragOver = false;
  }

  onDrag(event) {
    event.preventDefault();
  }

  onDragOver(event) {
    event.preventDefault();
  }

  onDragEnter(event) {
    console.log("Show UI to drop file", event);
    this.dragOver = true;
  }

  onDragLeave(event) {
    console.log("Hide UI to drop file", event);
    this.dragOver = false;
  }

  render() {
    return (
      <ion-card
        class={{ "drag-over": this.dragOver }}
        onDragEnter={(event) => this.onDragEnter(event)}
        onDragOver={(event) => this.onDragOver(event)}
        onDrag={(event) => this.onDrag(event)}
        onDrop={(event) => this.onDrop(event)}
        onDragLeave={(event) => this.onDragLeave(event)}
        onClick={() => this.openFile()}
      >
        <ion-item lines="none">
          <ion-icon name={this.icon ? this.icon : "document"} slot="start" />
          <div>
            <h2>
              {this.dragOver
                ? "Drop File Here"
                : this.label
                  ? this.label
                  : "Upload a File"}
            </h2>
            <p>
              {this.selectedFile
                ? this.selectedFile
                : this.defaultValue
                  ? this.defaultValue
                  : "Select a letterhead"}
            </p>
          </div>
        </ion-item>
        <input
          type="file"
          onChange={(event) => this.selectFile(event)}
          accept={this.accept ? this.accept : null}
          value="blah"
        />
      </ion-card>
    );
  }
}
