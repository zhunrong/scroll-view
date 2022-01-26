<template>
  <div class="scroll-view">
    <div ref="scroll" class="scroll-inner" @scroll="onScroll">
      <slot />
    </div>
    <div class="scroll-bar-x">
      <div
        ref="xScrollBar"
        class="scroll-bar-inner"
        @mousedown="onMouseDown($event, 'x')"
      ></div>
    </div>
    <div class="scroll-bar-y">
      <div
        ref="yScrollBar"
        class="scroll-bar-inner"
        @mousedown="onMouseDown($event, 'y')"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ResizeObserver } from "@juggle/resize-observer";

export default Vue.extend({
  data() {
    return {
      ro: undefined as unknown as ResizeObserver,
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
      scrollDirection: "x",
      mouseX: 0,
      mouseY: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const container = this.$el as HTMLDivElement;
      this.ro = new ResizeObserver(() => {
        this.onResize();
      });
      this.ro.observe(container);
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    });
  },
  beforeDestroy() {
    this.ro.disconnect();
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  },
  methods: {
    onResize() {
      const yScrollBar = this.$refs.yScrollBar as HTMLDivElement;
      const xScrollBar = this.$refs.xScrollBar as HTMLDivElement;
      this.calculate();
      Object.assign(yScrollBar.style, {
        height: `${this.yScrollBarHeight}px`,
        transform: `translate3d(0,${this.yScrollBarOffset}px,0)`,
      });
      Object.assign(xScrollBar.style, {
        width: `${this.xScrollBarWidth}px`,
        transform: `translate3d(${this.xScrollBarOffset}px,0,0)`,
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
    onMouseDown(e: MouseEvent, direction: "x" | "y") {
      this.scrolling = true;
      this.scrollDirection = direction;
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    },
    onMouseMove(e: MouseEvent) {
      if (!this.scrolling) return;
      const { pageX, pageY } = e;
      if (this.scrollDirection === "y") {
        const yScrollBar = this.$refs.yScrollBar as HTMLDivElement;
        const scroll = this.$refs.scroll as HTMLDivElement;
        const { yScrollBarOffset, scrollTop } = this.scrollY(
          pageY - this.mouseY
        );
        Object.assign(yScrollBar.style, {
          transform: `translate3d(0,${yScrollBarOffset}px,0)`,
        });
        scroll.scrollTop = scrollTop;
      } else {
        //
      }
    },
    onMouseUp(e: MouseEvent) {
      if (!this.scrolling) return;
      const { pageX, pageY } = e;
      if (this.scrollDirection === "y") {
        this.yScrollBarOffset = this.scrollY(
          pageY - this.mouseY
        ).yScrollBarOffset;
      } else {
        //
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
  },
});
</script>

<style lang="scss" scoped>
.scroll-view {
  height: 100%;
  overflow: hidden;
  position: relative;
  .scroll-inner {
    width: calc(100% + 17px);
    height: calc(100% + 17px);
    overflow: scroll;
  }
}

.scroll-bar-y {
  position: absolute;
  top: 0;
  right: 0;
  .scroll-bar-inner {
    width: 6px;
    height: 0px;
    border-radius: 3px;
    background: rgba(204, 204, 204, 0.5);
    user-select: none;
    &:hover {
      background: rgba(204, 204, 204, 1);
    }
  }
}

.scroll-bar-x {
  position: absolute;
  left: 0;
  bottom: 0;
  .scroll-bar-inner {
    height: 6px;
    width: 0px;
    border-radius: 3px;
    background: rgba(204, 204, 204, 0.5);
    user-select: none;
    &:hover {
      background: rgba(204, 204, 204, 1);
    }
  }
}
</style>
