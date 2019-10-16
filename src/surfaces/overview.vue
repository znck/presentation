<script>
import Events from "vue-global-events";
import { control } from "@/store/helpers";
import KeyboardNavigation from '@/store/components/KeyboardNavigation';

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
  },

  computed: control.computed,

  components: { Events, KeyboardNavigation },

  data: () => ({
    zoom: 1,
    column: 4,
    size: 300,
  }),

  created() {
    this.resize();
  },

  mounted() {
    window.addEventListener("resize", this.resize, { passive: true });
  },

  destroyed() {
    window.removeEventListener("resize", this.resize);
  },

  methods: {
    ...control.methods,
    resize() {
      const w = window.innerWidth;
      const c = (this.column = Math.max(1, Math.floor(w / this.size)));
      const itemWidth = (w - 32 - (c - 1) * 16) / c;
      this.zoom = itemWidth / w;
    },
    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
      if (event.ctrlKey || event.metaKey) return;
      if (event.altKey && event.code === "Equal") {
        this.size = window.innerWidth / Math.max(1, this.column - 1);
      } else if (event.altKey && event.code === "Minus") {
        this.size = window.innerWidth / Math.min(10, this.totalSlides, this.column + 1);
      }
    },
  },

  watch: {
    size() {
      this.resize();
    },
  },
};
</script>

<template>
  <div
    :class="$.overview"
    :style="{
          '--zoom': zoom,
          '--aspect': 1 / aspectRatio,
          '--row': Math.ceil(totalSlides / column),
          '--column': column,
        }"
  >
    <div
      v-for="(value, index) in totalSlides"
      :class="[$.item, currentSlide == index ? $.current : null]"
      :key="index"
      @mousedown.stop="setCurrentSlide(index)"
    >
      <div :class="$.wrapper">
        <slot :name="index"></slot>
      </div>
    </div>
    <Events @keydown="onKeyDown" />
    <KeyboardNavigation />
  </div>
</template>

<style module="$">
.overview {
  display: grid;
  --column-width: calc((100vw - 32px - ((var(--column) - 1) * 16px)) / var(--column));
  --column-height: calc(var(--column-width) * var(--aspect));
  grid-template-columns: repeat(var(--column), var(--column-width));
  grid-template-rows: repeat(var(--row), var(--column-height));
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  padding: 16px;
  background: darkgray;
}

.item {
  width: var(--column-width);
  height: var(--column-height);
  overflow: hidden;
  cursor: pointer;
}

.current {
  box-shadow: 0 0 0 4px #000;
}

.wrapper {
  width: 100vw;
  height: calc(100vw * var(--aspect));
  transform: scale(var(--zoom));
  transform-origin: top left;
  background-color: black;
  pointer-events: none;
  user-select: none;
}
</style>
