<script>
import { control } from '@/store/helpers';
import KeyboardNavigation from '@/store/components/KeyboardNavigation';
import MouseNavigation from '@/store/components/MouseNavigation';
import FitAspectRatio from '@/components/FitAspectRatio';
import ProvideSlideIndex from '@/components/ProvideSlideIndex.vue';

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
  },

  computed: control.computed,

  components: { FitAspectRatio, KeyboardNavigation, MouseNavigation, ProvideSlideIndex },
};
</script>

<template>
  <FitAspectRatio :aspectRatio="aspectRatio">
    <ProvideSlideIndex :index="currentSlide" :key="currentSlide">
      <slot :name="currentSlide" />
    </ProvideSlideIndex>
    <MouseNavigation />
    <KeyboardNavigation />
  </FitAspectRatio>
</template>
