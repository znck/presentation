<script>
import { getLayout } from "@/layouts";
import { layout, slideshow } from "@/store/helpers";
import LayoutSwitcher from "@/store/components/LayoutSwitcher";

export default {
  props: {
    aspectRatio: {
      type: Number,
      default: 16 / 9,
    },
    initialMode: {
      type: String,
      validate(value) {
        return /^(slideshow|overview)$/.test(value);
      },
    },
  },

  created() {
    if (this.initialMode) {
      this.setLayout(this.initialMode);
    }
  },

  computed: { ...layout.computed, ...slideshow.computed },
  methods: { ...layout.methods, ...slideshow.methods },

  render(h) {
    if (this.slideCount < 0) {
      this.setSlideCount(
        Object.keys(this.$scopedSlots).filter(key => /^\d+$/.test(key)).length
      );
    }

    return h(
      getLayout(this.layout),
      {
        scopedSlots: this.$scopedSlots,
        props: { aspectRatio: this.aspectRatio },
      },
      [h(LayoutSwitcher)]
    );
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

@media (prefers-color-scheme: dark) {
  body {
    background-color: darkgray;
  }
}
</style>
