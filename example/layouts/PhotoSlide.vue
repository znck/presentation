<script>
import Slide from './Slide.vue';

export default {
  props: {
    wide: Boolean,
  },
  components: { Slide },
};
</script>

<template>
  <Slide class="photo-slide" :class="{ wide }">
    <slot />
  </Slide>
</template>

<style>
.photo-slide {
  flex-direction: row;
}
.photo-slide.wide {
  flex-direction: column;
}
.photo-slide img {
  width: 60vw;
  height: 40vw;
  object-fit: contain;
}
</style>