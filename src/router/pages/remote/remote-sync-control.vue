<!-- This component sends remote control actions to admin/server. -->

<script>
import { root } from '@/store/helpers';
import { is, create } from '@/peer';
import store from '@/store';
import SyncVuex from '@/store/components/peer-sync-vuex.vue';

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

    // Listen to vuex actions on admin device.
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

    // Send vuex actions to admin device.
    this.$on(
      'hook:beforeDestroy',
      store.subscribeAction(action => {
        if (RE.test(action.type)) {
          if (!isSyncing) ch.sendMessage(this.target, create.vuexAction(action));
        }
      })
    );
  },

  components: { SyncVuex },
};
</script>

<template>
  <SyncVuex :from="target" />
</template>