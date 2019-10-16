<script>
import { control } from '@/store/helpers';
import KeyboardNavigation from '@/store/components/KeyboardNavigation';
import MouseNavigation from '@/store/components/MouseNavigation';
import FitAspectRatio from '@/components/FitAspectRatio';

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
  },

  computed: control.computed,

  components: { FitAspectRatio, KeyboardNavigation, MouseNavigation },
};
</script>

<template>
  <FitAspectRatio :aspectRatio="aspectRatio">
    <slot :name="currentSlide" />
    <MouseNavigation />
    <KeyboardNavigation />
  </FitAspectRatio>
</template>
