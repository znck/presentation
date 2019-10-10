<script>
import Events from "vue-global-events";
import { control } from "@/store/helpers";

export default {
  components: { Events },
  methods: control.methods,
};
</script>

<template>
  <Events
    @keydown.arrow-up="previous"
    @keydown.arrow-left="previous"
    @keydown.page-up="previous"
    @keydown.page-down="next"
    @keydown.arrow-right="next"
    @keydown.arrow-down="next"
  />
</template>
