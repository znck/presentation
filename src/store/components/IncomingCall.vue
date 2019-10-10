<template>
  <div :class="$.call">
    <div v-if="hasIncomingCall">
      <button @click="accept">Accept</button>
    </div>
    <video v-else-if="isCallReady" ref="video" controls autoplay></video>
    <div v-else-if="status === 'disconnect'">Call Ended!</div>
  </div>
</template>

<script>
import { communication } from "@/store/helpers";

export default {
  computed: {
    ...communication.computed,
    id() {
      const ids = Object.keys(this.incomingCalls);

      return ids.length ? ids[0] : null;
    },
    status() {
      return this.incomingCalls[this.id];
    },
    hasIncomingCall() {
      return this.status === "incoming";
    },
    isCallReady() {
      const status = this.status;

      return status === "connecting" || status === "connected";
    },
  },
  methods: {
    ...communication.methods,
    async accept() {
      if (this.id) this.answer(this.id);
    },
  },
  watch: {
    async status(value) {
      if (value === "connected") {
        setTimeout(() => {
          const video = this.$refs.video;
          const stream = this.getStream(this.id);
          video.srcObject = stream;
        }, 1000);
      }
    },
  },
};
</script>

<style module="$">
.call video {
  width: 40vw;
  background: black;
}
</style>
