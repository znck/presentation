<!-- This component sends remote control actions to admin/server. -->

<script>
import { root } from '@/store/helpers';
import { is, create } from '@/peer';
import store from '@/store';

export default {
  props: {
    target: {
      type: String,
      required: true,
    },
  },

  methods: {
    ...root.methods,
  },

  async created() {
    const RE = /^control\/(?:setCurrentSlide)$/;
    const ch = await this.channel();
    let isSyncing = false;

    // Sync remote store with local store.
    this.$on(
      'hook:beforeDestroy',
      ch.onMessage(async (user, message) => {
        if (user.id === this.target) {
          if (is.vuexAction(message)) {
            const action = message.payload;
            if (RE.test(action.type)) {
              isSyncing = true;
              await store.dispatch(action.type, action.payload);
              isSyncing = false;
            }
          }
        }
      })
    );

    // Sync local store with remote store.
    this.$on(
      'hook:beforeDestroy',
      store.subscribeAction(action => {
        if (RE.test(action.type)) {
          if (!isSyncing) ch.sendMessage(this.target, create.vuexAction(action));
        }
      })
    );
  },

  render(h) {
    return h(null);
  },
};
</script>
