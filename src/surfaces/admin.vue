<script>
import { control } from '@/store/helpers';
import FitAspectRatio from '@/components/FitAspectRatio.vue';
import Timer from '@/components/Timer.vue';
import KeyboardNavigation from '@/store/components/KeyboardNavigation';

export default {
  props: {
    aspectRatio: {
      type: Number,
      required: true,
    },
  },

  data() {
    return { width: window.innerWidth };
  },

  mounted() {
    const handler = () => (this.width = window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    this.$on('hook:destroyed', () => window.removeEventListener('resize', handler));
  },

  computed: control.computed,
  methods: control.methods,

  components: { FitAspectRatio, KeyboardNavigation, Timer },
};
</script>

<template>
  <div :class="$.speaker">
    <div :class="$.currentSlide">
      <FitAspectRatio :aspectRatio="aspectRatio * 2">
        <div :class="$.currentSlideWrapper">
          <FitAspectRatio :aspectRatio="aspectRatio" :multiplier="(width - 32) / 2 / width" style="--fix-origin: center">
            <slot :name="currentSlide" />
          </FitAspectRatio>
          <div :class="$.notes">
            <slot :name="'notes-' + currentSlide" />
          </div>
        </div>
      </FitAspectRatio>
    </div>

    <div :class="$.nextSlide" @click.capture.stop="next">
      <FitAspectRatio :aspectRatio="aspectRatio" :multiplier="(width - 160) / 2 / width * 0.8">
        <slot :name="currentSlide + 1" />
      </FitAspectRatio>
    </div>

    <div :class="$.controls">
      <slot>
        <Timer />
      </slot>
    </div>

    <KeyboardNavigation />
  </div>
</template>

<style module="$">
.speaker {
  display: grid;
  grid-template-columns: 50% auto;
  grid-template-rows: 60% 40%;
  grid-column-gap: 0px;
  grid-row-gap: 16px;
  padding: 16px;
  height: 100vh;
  width: 100vw;
  background-color: #333;
}

.currentSlide {
  grid-area: 1 / 1 / 2 / 3;
  display: flex;
  align-items: center;
  pointer-events: none;
  user-select: none;

  --fix-origin: top left;
  --fit-width: calc(100vw - 32px);
}

.currentSlideWrapper {
  display: flex;
  border-radius: 4px;
  height: 100%;
  overflow: hidden;
  background-color: white;
}

.currentSlideWrapper > * {
  flex: 1;
}

.nextSlide {
  grid-area: 2 / 1 / 3 / 2;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 64px 16px;
}

.nextSlide > * {
  pointer-events: none;
  user-select: none;
}

.currentSlide > div > div,
.nextSlide > div > div {
  border-radius: calc(4px * (1 / var(--zoom)));
  overflow: hidden;
}

.controls {
  grid-area: 2 / 2 / 3 / 3;
}

.notes > aside {
  padding: 16px;
}

.notes:empty {
  background-color: gray;
}
</style>
