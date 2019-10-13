<script>
import Events from 'vue-global-events';
import User from '@/components/User';
import SurfaceSwitcher from '@/store/components/SurfaceSwitcher.vue';
import AdminRemoteConnection from '@/router/pages/admin/admin-remote-connection.vue';
import AdminSlideshowConnection from '@/router/pages/admin/admin-slideshow-connection.vue';
import { createChannel } from '@/peer';
import { root, users, streams, surface } from '@/store/helpers';

const channel = createChannel('admin');

const isPresentationSupported = 'presentation' in navigator;
const { protocol, hostname, port } = window.location;
const request = isPresentationSupported
  ? new PresentationRequest([
      protocol + '//' + hostname + (port ? ':' + port : '') + '/?id=' + channel.id + '&secret=' + channel.secret,
    ])
  : null;

if (isPresentationSupported) navigator.presentation.defaultRequest = request;

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
  },
  created() {
    this.setup(channel);
    this.setSurface('admin');
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
    async startPresenting() {
      const connection = await request.start();
    },
  },
  watch: {
    async activeCallId(id) {
      const stream = await this.getCallStream(id);
      if (stream) {
        this.$refs.video.srcObject = stream;
      }
    },
  },
  components: { User, SurfaceSwitcher, AdminRemoteConnection, AdminSlideshowConnection, Events },
};
</script>

<template>
  <div :class="$.container">
    <SurfaceSwitcher />
    <Presentation />
    <Events @keydown.alt.80.exact="startPresenting" />
    <div :class="$.controls">
      <AdminRemoteConnection :id="id" />
      <AdminSlideshowConnection />
    </div>
  </div>
</template>

<style module="$">
.controls {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 16px;
}
</style>