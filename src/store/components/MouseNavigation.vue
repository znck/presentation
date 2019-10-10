<script>
import Events from "vue-global-events";
import { control } from "@/store/helpers";

export default {
  components: { Events },
  methods: {
    ...control.methods,
    /**
     * @param {MouseEvent} event
     */
    handleMouseDown(event) {
      if (event.defaultPrevented) return;

      if (event.target instanceof Element) {
        if (/^(a|button|input|textarea|select)$/i.test(event.target.tagName)) {
          return;
        }
      }

      event.preventDefault();
      const ratio = event.x / window.innerWidth;
      if (ratio < 0.4) this.previous();
      else if (ratio > 0.6) this.next();
    },
  },
};
</script>

<template>
  <Events @mousedown.left="handleMouseDown" />
</template>
