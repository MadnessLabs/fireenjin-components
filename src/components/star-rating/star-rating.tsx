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
  Build
} from "@stencil/core";

@Component({
  tag: "fireenjin-star-rating",
  styleUrl: "star-rating.css"
})
export class StarRating implements ComponentInterface {
  @Element() starRatingEl: any;

  @Event() fireenjinStarRating: EventEmitter;

  @Prop() disabled = false;
  @Prop() name = "rating";
  @Prop() maxRating = 5;
  @Prop() value: string;

  @State() currentRating: number;

  @Listen("input")
  onInput(event) {
    console.log(event);
    if (this.disabled) {
      return false;
    }
    this.currentRating = parseFloat(event.target.value);
    this.fireenjinStarRating.emit({
      event,
      name: this.name,
      value: this.currentRating
    });
  }

  @Method()
  async setCurrentRating(rating: any) {
    this.currentRating = parseFloat(rating);
  }

  @Watch("value")
  onValueChange() {
    this.currentRating = parseFloat(this.value);
  }

  componentDidLoad() {
    if (Build.isBrowser) {
      this.currentRating = parseFloat(this.value ? this.value : "0");
      this.starRatingEl.style.setProperty(
        "--star-rating-max",
        `${this.maxRating}`
      );
    }
  }

  render() {
    return (
      <div class={this.disabled ? "star-rating is-disabled" : "star-rating"}>
        {[...Array(this.maxRating)].map((_radio, index) => [
          <label
            class={
              this.currentRating >= this.maxRating - index - 0.5
                ? "star-active"
                : null
            }
          >
            <input
              type="radio"
              name={this.name}
              value={this.maxRating - index}
              onInput={event => this.onInput(event)}
            />
            &#9733;
          </label>
        ])}
      </div>
    );
  }
}
