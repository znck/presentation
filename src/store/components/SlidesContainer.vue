<script>
import { surface, control } from '@/store/helpers';
import { getSurface } from '@/surfaces';

export default {
  inheritAttrs: false,

  props: {
    aspectRatio: {
      type: Number,
      default: 16 / 9,
    },
    timer: {
      type: Number,
      default: 30,
    },
  },

  provide() {
    return {
      config: {
        ...this.$props,
        ...this.$attrs,
      },
    };
  },

  computed: {
    ...surface.computed,
    ...control.computed,
  },

  methods: control.methods,

  render(h) {
    if (this.totalSlides < 0) {
      this.setTotalSlides(Object.keys(this.$scopedSlots).filter(key => /^\d+$/.test(key)).length);
    }

    return h(getSurface(this.surface), {
      scopedSlots: this.$scopedSlots,
      props: { aspectRatio: this.aspectRatio },
    });
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: lightgray;
}
</style>
