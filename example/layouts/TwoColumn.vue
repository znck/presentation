<script>
import Slide from './Slide.vue';

export default {
  components: { Slide },
};
</script>

<template>
  <Slide class="two-column-slide">
    <slot />
  </Slide>
</template>

<style>
.two-column-slide {
  flex-direction: row;
}

.two-column-slide > *:not(:first-child) {
  margin-left: 2vw;
}
</style>
