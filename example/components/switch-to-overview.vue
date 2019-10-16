<script>
import { mapState, mapActions } from 'vuex';

let slideIndex = -1;
export default {
  computed: {
    ...mapState('surface', ['surface']),
    ...mapState('control', ['currentSlide']),
    ...mapState(['role']),
  },
  methods: mapActions('surface', ['setSurface']),
  mounted() {
    if (this.role === 'slideshow' && this.surface !== 'overview') {
      slideIndex = this.currentSlide;
      this.setSurface('overview');
    }
  },
  watch: {
    currentSlide(value) {
      if (this.role === 'slideshow' && this.surface === 'overview' && value !== slideIndex) {
        this.setSurface('slideshow');
      }
    },
  },
  render(h) {
    return h(null);
  },
};
</script>
