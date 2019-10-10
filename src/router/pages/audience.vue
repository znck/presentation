<script>
import { root, streams, users } from "@/store/helpers";
import { createChannel } from "@/peer";

const channel = createChannel(false);

export default {
  props: {
    id: String,
  },
  data() {
    return { name: "", email: "", error: null, status: "disconnected" };
  },
  computed: {
    ...streams.computed,
    ...users.computed,
    server() {
      const id = this.id;

      return this.onlineUsers.find(user => user.id === id);
    },
    callFromServer() {
      return this.incomingCalls.find(call => call.user.id === this.id);
    },
  },
  methods: {
    ...root.methods,
    ...streams.methods,
    async connect() {
      this.status = "connecting";
      channel.setName(this.name);
      channel.setEmail(this.email);

      await channel.connect(this.id);
    },
    async callServer() {
      if (!this.server) return;

      const stream = await this.call({
        user: this.server,
        stream: await navigator.mediaDevices.getUserMedia({ audio: true, video: true }),
      });

      this.$refs.video.srcObject = stream;
    },
  },
  async created() {
    this.setup(channel);
  },
  watch: {
    server(value) {
      if (!value) {
        this.status = "disconnected";
        this.connect();
      } else this.status = "connected";
    },
    async callFromServer(value, prevValue) {
      if (value) {
        const stream = await this.acceptCall({
          user: this.server,
        });

        if (stream) this.$refs.video.srcObject = stream;
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <form class="intro" v-if="status !== 'connected'" @submit.prevent="connect">
      <label>
        Name:
        <input type="text" name="name" required v-model="name" />
      </label>

      <label>
        Email:
        <input type="email" name="email" required v-model="email" />
      </label>

      <button
        type="submit"
        :disabled="status === 'connecting'"
      >{{ status === 'connecting' ? 'Please wait...' : 'Start!' }}</button>
    </form>

    <div class="info" v-else>
      Connected to {{ server.name }}
      <video autoplay ref="video"></video>
      <button type="button" @click="callServer">Call</button>
    </div>
  </div>
</template>

<style>
video {
  max-width: 100vw;
  max-height: 100vh;
}
</style>
