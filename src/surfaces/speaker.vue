<script>
import { control } from "@/store/helpers";
import FitAspectRatio from "@/components/FitAspectRatio.vue";
import KeyboardNavigation from "@/store/components/KeyboardNavigation";

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
  },

  computed: control.computed,
  methods: control.methods,

  components: { FitAspectRatio, KeyboardNavigation },
};
</script>

<template>
  <div :class="$.speaker">
    <div :class="$.currentSlide">
      <FitAspectRatio :aspectRatio="aspectRatio" :multiplier="0.35">
        <slot :name="currentSlide" />
      </FitAspectRatio>
    </div>
    <div :class="$.nextSlide" @click.capture.stop="next">
      <FitAspectRatio :aspectRatio="aspectRatio" :multiplier="0.25">
        <slot :name="currentSlide + 1" />
      </FitAspectRatio>
    </div>
    <div :class="$.notes">
      <slot :name="'notes-' + currentSlide" />
    </div>

    <KeyboardNavigation />
  </div>
</template>

<style module="$">
.speaker {
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 40% 60%;
  grid-column-gap: 16px;
  grid-row-gap: 0px;
  padding: 16px;
  height: 100vh;
  width: 100vw;
  background-color: lightgray;
}

.currentSlide {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  align-items: center;
  pointer-events: none;
  user-select: none;
}

.nextSlide {
  grid-area: 1 / 2 / 2 / 3;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nextSlide > * {
  pointer-events: none;
  user-select: none;
}

.notes {
  grid-area: 2 / 1 / 3 / 3;
  background-color: white;
  margin: 0 0 -16px -16px;
  padding: 16px;
  overflow: auto;
}

.notes:empty {
  background-color: gray;
}
</style>
