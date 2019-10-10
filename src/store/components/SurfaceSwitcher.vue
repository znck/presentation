<script>
import Events from "vue-global-events";
import { surface } from "@/store/helpers";

export default {
  components: { Events },
  methods: {
    ...surface.methods,
    fullScreen() {
      document.body.requestFullscreen();
    },
  },
};
</script>

<template>
  <Events
    @keydown.alt.49.exact="setSurface('slideshow')"
    @keydown.alt.50.exact="setSurface('speaker')"
    @keydown.alt.51.exact="setSurface('overview')"
    @keydown.alt.70.exact="fullScreen"
  />
</template>
