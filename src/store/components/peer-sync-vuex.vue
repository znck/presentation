<script>
import store from '@/store';
import { root } from '@/store/helpers';
import { is, create } from '@/peer';

export default {
  props: {
    from: String,
    to: String,
  },
  methods: root.methods,
  async created() {
    const channel = await this.channel();
    const RE = /^(?:sync|control\/(?:setCurrentSlide))$/;

    let isSyncing = false;

    this.$on(
      'hook:beforeDestroy',
      channel.onMessage(async (user, message) => {
        if (user.id === this.from) {
          if (is.vuexAction(message)) {
            const action = message.payload;
            isSyncing = true;
            await store.dispatch(action.type, action.payload);
            isSyncing = false;
          }
        }
      })
    );

    this.$on(
      'hook:beforeDestroy',
      store.subscribeAction(action => {
        if (RE.test(action.type)) {
          if (!isSyncing) channel.sendMessage(this.to, create.vuexAction(action));
        }
      })
    );
  },

  destroyed() {
    if (this.handle) this.handle();
  },

  render(h) {
    return h(null);
  },
};
</script>
