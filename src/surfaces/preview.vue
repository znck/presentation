<script>
import { control } from "@/store/helpers";
import FitAspectRatio from "@/components/FitAspectRatio";

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
  },

  computed: control.computed,

  components: { FitAspectRatio },
};
</script>

<template>
  <FitAspectRatio :aspectRatio="aspectRatio">
    <slot :name="currentSlide" />
  </FitAspectRatio>
</template>
