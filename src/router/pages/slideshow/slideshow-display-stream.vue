<script>
import { root, streams } from '@/store/helpers';

export default {
  computed: {
    ...root.computed,
    ...streams.computed,
    current() {
      return this.activeCalls.find(call => call.status === 'connected');
    },
  },
  methods: {
    ...root.methods,
    ...streams.methods,
  },
  watch: {
    incomingCalls: {
      deep: true,
      handler(calls) {
        const serverId = this.serverId
        calls.forEach(async call => {
          if (call.user.id === serverId) {
            const stream = await this.acceptCall(call);

            this.$nextTick(() => {
              this.$refs.video.srcObject = stream;
            });
          }
        });
      },
    },
  },
};
</script>

<template>
  <div v-if="current" :class="[$.container, $[current.user.streamType]]">
    <video autoplay muted ref="video" />
  </div>
</template>

<style module="$">
.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 25vw;
  background: black;
  box-shadow: -0.5vw 0 1vw 0 rgba(0, 0, 0, 0.5);
}

.fullscreen {
  width: 100vw;
}

.container video {
  max-width: 100%;
}
</style>