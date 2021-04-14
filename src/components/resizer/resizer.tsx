import {
  Component,
  ComponentInterface,
  Host,
  Prop,
  h,
} from "@stencil/core";

const styles: { [key: string]: React.CSSProperties } = {
    top: {
      width: '100%',
      height: '10px',
      top: '-5px',
      left: '0px',
      cursor: 'row-resize',
    },
    right: {
      width: '10px',
      height: '100%',
      top: '0px',
      right: '-5px',
      cursor: 'col-resize',
    },
    bottom: {
      width: '100%',
      height: '10px',
      bottom: '-5px',
      left: '0px',
      cursor: 'row-resize',
    },
    left: {
      width: '10px',
      height: '100%',
      top: '0px',
      left: '-5px',
      cursor: 'col-resize',
    },
    topRight: {
      width: '20px',
      height: '20px',
      position: 'absolute',
      right: '-10px',
      top: '-10px',
      cursor: 'ne-resize',
    },
    bottomRight: {
      width: '20px',
      height: '20px',
      position: 'absolute',
      right: '-10px',
      bottom: '-10px',
      cursor: 'se-resize',
    },
    bottomLeft: {
      width: '20px',
      height: '20px',
      position: 'absolute',
      left: '-10px',
      bottom: '-10px',
      cursor: 'sw-resize',
    },
    topLeft: {
      width: '20px',
      height: '20px',
      position: 'absolute',
      left: '-10px',
      top: '-10px',
      cursor: 'nw-resize',
    },
  };
  
type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

type OnStartCallback = (
    e: any,
    dir: Direction,
  ) => void;

@Component({
  tag: "fireenjin-resizer",
})
export class Resizer implements ComponentInterface {
  /**
   * The resize direction
   */
  @Prop() direction: Direction;
  /**
   * The styles to replace
   */
  @Prop() replaceStyles?: any;
  /**
   * A callback fired w
   */
  @Prop() onResizeStart: OnStartCallback;

  render() {
    return (
        <Host
          style={{
            position: 'absolute',
            userSelect: 'none',
            ...styles[this.direction],
            ...(this.replaceStyles || {}),
          }}
          onMouseDown={(e) => {
            this.onResizeStart(e, this.direction);
          }}
          onTouchStart={ (e: React.TouchEvent<HTMLDivElement>) => {
            this.onResizeStart(e, this.direction);
          }}
        >
          <slot />
        </Host>
      );
  }
}
