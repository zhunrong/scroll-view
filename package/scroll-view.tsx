import Vue from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import './scroll-view.scss';

export default Vue.extend({
  name: 'ScrollView',
  props: {
    showScrollBar: {
      type: String,
      default: 'hover',
    },
  },
  data() {
    const data = {
      clientHeight: 0,
      clientWidth: 0,
      scrollHeight: 0,
      scrollWidth: 0,
      yScrollBarHeight: 0,
      yScrollBarOffset: 0,
      xScrollBarWidth: 0,
      xScrollBarOffset: 0,
      // mouse
      scrolling: false,
      scrollDirection: 'x',
      mouseX: 0,
      mouseY: 0,
    };
    return data as typeof data & {
      $ro: ResizeObserver;
    };
  },
  computed: {
    className() {
      return /^(hover|always)$/.test(this.showScrollBar)
        ? this.showScrollBar
        : 'hover';
    },
  },
  mounted() {
    this.$nextTick(() => {
      const scrollContent = this.$refs.scrollContent as HTMLDivElement;
      this.$ro = new ResizeObserver(() => {
        this.onResize();
      });
      this.$ro.observe(scrollContent);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    });
  },
  beforeDestroy() {
    this.$ro.disconnect();
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  },
  methods: {
    onResize() {
      const yScrollBar = this.$refs.yScrollBar as HTMLDivElement;
      const xScrollBar = this.$refs.xScrollBar as HTMLDivElement;
      this.calculate();
      Object.assign(yScrollBar.style, {
        height: `${this.yScrollBarHeight}px`,
        transform: `translate3d(0,${this.yScrollBarOffset}px,0)`,
        display: this.yScrollBarHeight === this.clientHeight ? 'none' : 'block',
      });
      Object.assign(xScrollBar.style, {
        width: `${this.xScrollBarWidth}px`,
        transform: `translate3d(${this.xScrollBarOffset}px,0,0)`,
        display: this.xScrollBarWidth === this.clientWidth ? 'none' : 'block',
      });
    },
    onScroll() {
      if (this.scrolling) return;
      const yScrollBar = this.$refs.yScrollBar as HTMLDivElement;
      const xScrollBar = this.$refs.xScrollBar as HTMLDivElement;
      this.calculate();
      Object.assign(yScrollBar.style, {
        transform: `translate3d(0,${this.yScrollBarOffset}px,0)`,
      });
      Object.assign(xScrollBar.style, {
        transform: `translate3d(${this.xScrollBarOffset}px,0,0)`,
      });
    },
    onMouseDown(e: MouseEvent, direction: 'x' | 'y') {
      this.scrolling = true;
      this.scrollDirection = direction;
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    },
    onMouseMove(e: MouseEvent) {
      if (!this.scrolling) return;
      const { pageX, pageY } = e;
      const scroll = this.$refs.scroll as HTMLDivElement;
      if (this.scrollDirection === 'y') {
        const yScrollBar = this.$refs.yScrollBar as HTMLDivElement;
        const { yScrollBarOffset, scrollTop } = this.scrollY(
          pageY - this.mouseY
        );
        Object.assign(yScrollBar.style, {
          transform: `translate3d(0,${yScrollBarOffset}px,0)`,
        });
        scroll.scrollTop = scrollTop;
      } else {
        const xScrollBar = this.$refs.xScrollBar as HTMLDivElement;
        const { xScrollBarOffset, scrollLeft } = this.scrollX(
          pageX - this.mouseX
        );
        Object.assign(xScrollBar.style, {
          transform: `translate3d(${xScrollBarOffset}px,0,0)`,
        });
        scroll.scrollLeft = scrollLeft;
      }
    },
    onMouseUp(e: MouseEvent) {
      if (!this.scrolling) return;
      const { pageX, pageY } = e;
      if (this.scrollDirection === 'y') {
        this.yScrollBarOffset = this.scrollY(
          pageY - this.mouseY
        ).yScrollBarOffset;
      } else {
        this.xScrollBarOffset = this.scrollX(
          pageX - this.mouseX
        ).xScrollBarOffset;
      }
      this.scrolling = false;
    },
    calculate() {
      const scroll = this.$refs.scroll as HTMLDivElement;
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = scroll;
      // y
      const yScrollBarHeight = (clientHeight / scrollHeight) * clientHeight;
      const spaceHeight = clientHeight - yScrollBarHeight;
      const yScrollBarOffset =
        (scrollTop / (scrollHeight - clientHeight)) * spaceHeight;
      // x
      const xScrollBarWidth = (clientWidth / scrollWidth) * clientWidth;
      const spaceWidth = clientWidth - xScrollBarWidth;
      const xScrollBarOffset =
        (scrollLeft / (scrollWidth - clientWidth)) * spaceWidth;
      // assign
      this.clientHeight = clientHeight;
      this.scrollHeight = scrollHeight;
      this.yScrollBarHeight = yScrollBarHeight;
      this.yScrollBarOffset = yScrollBarOffset;
      this.clientWidth = clientWidth;
      this.scrollWidth = scrollWidth;
      this.xScrollBarWidth = xScrollBarWidth;
      this.xScrollBarOffset = xScrollBarOffset;
    },
    scrollY(movement: number) {
      let yScrollBarOffset = this.yScrollBarOffset + movement;
      const spaceHeight = this.clientHeight - this.yScrollBarHeight;
      yScrollBarOffset = Math.max(0, yScrollBarOffset);
      yScrollBarOffset = Math.min(spaceHeight, yScrollBarOffset);
      const scrollTop = spaceHeight
        ? (yScrollBarOffset / spaceHeight) *
          (this.scrollHeight - this.clientHeight)
        : 0;
      return { yScrollBarOffset, scrollTop };
    },
    scrollX(movement: number) {
      let xScrollBarOffset = this.xScrollBarOffset + movement;
      const spaceWidth = this.clientWidth - this.xScrollBarWidth;
      xScrollBarOffset = Math.max(0, xScrollBarOffset);
      xScrollBarOffset = Math.min(spaceWidth, xScrollBarOffset);
      const scrollLeft = spaceWidth
        ? (xScrollBarOffset / spaceWidth) *
          (this.scrollWidth - this.clientWidth)
        : 0;
      return { xScrollBarOffset, scrollLeft };
    },
  },
  render() {
    return (
      <div class={`scroll-view ${this.className}`}>
        <div ref="scroll" class="scroll-container" onScroll={this.onScroll}>
          <div ref="scrollContent" class="scroll-content">
            {this.$slots.default}
          </div>
        </div>
        <div class="scroll-bar scroll-bar-x">
          <div
            ref="xScrollBar"
            class="scroll-bar-inner"
            onMousedown={(e: MouseEvent) => this.onMouseDown(e, 'x')}
          ></div>
        </div>
        <div class="scroll-bar scroll-bar-y">
          <div
            ref="yScrollBar"
            class="scroll-bar-inner"
            onMousedown={(e: MouseEvent) => this.onMouseDown(e, 'y')}
          ></div>
        </div>
      </div>
    );
  },
});
