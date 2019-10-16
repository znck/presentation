<script>
import { root, streams, users } from '@/store/helpers';
import { createChannel } from '@/peer';
import Question from './question.vue';

const channel = createChannel(false);

function getFromLocalStorage() {
  const value = localStorage.getItem('info');

  return {
    name: '',
    email: '',
    ...(value ? JSON.parse(value) : null),
  };
}

function setFromLocalStorage(payload) {
  localStorage.setItem('info', JSON.stringify(payload));
}

export default {
  props: {
    id: String,
  },
  data() {
    return { ...getFromLocalStorage(), error: null, status: 'disconnected' };
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
  components: {
    Question,
  },
  methods: {
    ...root.methods,
    ...streams.methods,
    async connect() {
      this.status = 'connecting';
      channel.setName(this.name);
      channel.setEmail(this.email);

      setFromLocalStorage({ name: this.name, email: this.email });

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
    if (this.id) {
      await this.$store.commit('SET_SERVER_ID', this.id);
    }

    this.setup(channel);
  },
  watch: {
    server(value) {
      if (!value) {
        this.status = 'disconnected';
        this.connect();
      } else this.status = 'connected';
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
  <div :class="$.container">
    <form v-if="status !== 'connected'" @submit.prevent="connect">
      <label>
        Name
        <input
          type="text"
          name="name"
          required
          v-model="name"
          :disabled="status === 'connecting'"
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          required
          v-model="email"
          :disabled="status === 'connecting'"
        />
      </label>

      <button
        type="submit"
        :disabled="status === 'connecting'"
      >{{ status === 'connecting' ? 'Please wait...' : 'Start!' }}</button>
    </form>

    <div :class="$.content" v-else>
      <Question />
      <code>connected</code>
    </div>
  </div>
</template>

<style module="$">
.container {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.container label,
.container input {
  display: block;
}

.container label {
  margin-bottom: 1rem;
}
.container input {
  width: 300px;
  padding: 0.5rem;
  font-size: 1.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
}

.container button {
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.content > code {
  position: fixed;
  bottom: 1rem;
  margin: 0 auto;
}
</style>
