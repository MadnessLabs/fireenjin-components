import { Component, ComponentInterface, Prop, h } from "@stencil/core";

@Component({
  tag: "fireenjin-progress-circle",
  styleUrl: "progress-circle.css",
  shadow: true
})
export class ProgressCircle implements ComponentInterface {
  /**
   * The percent value of progress filled between 0 and 100
   */
  @Prop({ mutable: true }) percent = 0;
  /**
   * The radius size of the circle in pixels
   */
  @Prop() radius = 60;
  /**
   * The stroke thickness of the progress bar
   */
  @Prop() stroke = 5;

  // componentDidLoad() {
  //   let i = 0;
  //   const killInterval = setInterval(() => {
  //     this.percent = i;
  //     i++;
  //     if (i > 100) {
  //       clearInterval(killInterval);
  //     }
  //   }, 600);
  // }

  render() {
    const normalizedRadius = this.radius - this.stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return [
      <svg height={this.radius * 2} width={this.radius * 2}>
        <circle
          id="track"
          fill="transparent"
          stroke-dasharray={circumference}
          stroke-width={this.stroke}
          r={normalizedRadius}
          cx={this.radius}
          cy={this.radius}
        />
        <circle
          id="progress"
          fill="transparent"
          stroke-dasharray={circumference}
          style={{
            strokeDashoffset: (circumference -
              (this.percent / 100) * circumference) as any
          }}
          stroke-width={this.stroke}
          r={normalizedRadius}
          cx={this.radius}
          cy={this.radius}
        />
      </svg>,
      <div class="slot-wrapper">
        <slot />
      </div>
    ];
  }
}
