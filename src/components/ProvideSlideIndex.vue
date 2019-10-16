<script>
export default {
  props: {
    index: Number,
  },
  provide() {
    return {
      slideIndex: this.index,
    };
  },
  render() {
    const [vnode] = this.$scopedSlots.default ? this.$scopedSlots.default() : [];

    return vnode;
  }
};
</script>
