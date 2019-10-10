<script>
import { getZoomToFitAspectRatio } from "@/utils";

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
    multiplier: {
      type: Number,
      default: 1,
    },
  },

  data: () => ({
    zoom: 1,
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
    resize() {
      this.zoom = getZoomToFitAspectRatio(this.aspectRatio, window.innerWidth, window.innerHeight) * this.multiplier;
    },
  },
};
</script>

<template>
  <div :class="$.container" :style="`--zoom: ${this.zoom}; --aspect: ${1/aspectRatio}`">
    <div :class="$.content">
      <slot />
    </div>
  </div>
</template>

<style module="$">
.container {
  width: 100%;
  height: 100%;
  max-height: calc(100vw * var(--aspect) * var(--zoom));
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.content {
  width: 100vw;
  height: calc(100vw * var(--aspect));
  background-color: black;
  margin-left: auto;
  margin-right: auto;
  transform: scale(var(--zoom));
  transform-origin: center;
  flex-basis: 100vw;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>