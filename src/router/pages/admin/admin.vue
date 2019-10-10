<script>
import User from '@/components/User';
import ReceiveControlCommand from '@/store/components/ReceiveControlCommands.vue';
import SurfaceSwitcher from '@/store/components/SurfaceSwitcher.vue';
import AdminRemoteConnection from '@/router/pages/admin/admin-remote-connection.vue';
import { createChannel } from '@/peer';
import { root, users, streams, surface } from '@/store/helpers';

const channel = createChannel('admin');

export default {
  data() {
    return {
      id: channel.id,
      activeCallId: null,
    };
  },
  computed: {
    ...users.computed,
    ...streams.computed,
    ...surface.computed,
    incomingIds() {
      return new Set(this.incomingCalls.map(call => call.user.id));
    },
    audienceURL() {
      const id = this.id;
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : ''}/audience?id=${id}`;
    },
    slideshowURL() {
      const id = this.id;
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : ''}?id=${id}`;
    },
    remoteURL() {
      const id = this.id;
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : ''}/remote?id=${id}`;
    },
  },
  created() {
    this.setup(channel);
    this.setSurface('speaker');
  },
  methods: {
    ...streams.methods,
    ...root.methods,
    ...surface.methods,
    async answer(user, type = 'none') {
      await this.acceptCall({ user, stream: await navigator.mediaDevices.getDisplayMedia() });
      this.activeCallId = user.id;
    },
    async startCall(user, type = 'none') {
      await this.call({ user, stream: await navigator.mediaDevices.getUserMedia({ audio: true, video: true }) });
      this.activeCallId = user.id;
    },

    async addAsRemote(user) {},
  },
  watch: {
    async activeCallId(id) {
      const stream = await this.getCallStream(id);
      if (stream) {
        this.$refs.video.srcObject = stream;
      }
    },
  },
  components: { User, SurfaceSwitcher, ReceiveControlCommand, AdminRemoteConnection },
};
</script>

<template>
  <div class="container">
    <pre>{{audienceURL}}</pre>
    <pre>{{remoteURL}}</pre>
    <pre>{{slideshowURL}}</pre>
    <AdminRemoteConnection />
    <SurfaceSwitcher />
    <Presentation />

    <video ref="video" autoplay :hidden="!activeCallId" />
    <ul>
      <li v-for="user in users" :key="user.id">
        <User v-bind="user">
          <button v-if="incomingIds.has(user.id)" type="button" @click="answer(user)">Answer</button>
          <button v-if="!incomingIds.has(user.id)" type="button" @click="startCall(user)">Call</button>
        </User>
      </li>
    </ul>
  </div>
</template>

<style>
</style>