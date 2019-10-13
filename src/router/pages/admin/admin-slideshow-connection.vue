<!-- This component connects slideshow clients. -->
<!-- This component sends remote control actions to admin/server. -->

<script>
import { root, slideshows } from '@/store/helpers';
import { is, create } from '@/peer';
import store from '@/store';

export default {
  props: {
    target: {
      type: String,
    },
  },

  methods: {
    ...root.methods,
  },

  computed: {
    ...slideshows.computed,
  },

  async created() {
    const RE = /^control\/(?:setCurrentSlide)$/;
    const ch = await this.channel();

    // Sync local store with remote store.
    this.$on(
      'hook:beforeDestroy',
      store.subscribeAction(action => {
        if (RE.test(action.type)) {
          if (this.slideshowId) ch.sendMessage(this.slideshowId, create.vuexAction(action));
        }
      })
    );
  },

  render(h) {
    return h(null);
  },
};
</script>
