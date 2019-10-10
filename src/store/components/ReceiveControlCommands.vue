<script>
import store from '@/store';
import { root } from '@/store/helpers';

export default {
  props: {
    from: {
      type: String,
      required: true,
    },
  },
  methods: root.methods,
  async created() {
    const channel = await this.channel();

    this.handle = channel.onMessage((user, data) => {
      if (user.id !== this.from) return;
      if (data.type === '@vs/control-command') {
        const { type, payload } = data.payload;
        store.commit(type, payload);
      }
    });
  },

  destroyed() {
    if (this.handle) this.handle();
  },

  render(h) {
    return h(null);
  },
};
</script>
