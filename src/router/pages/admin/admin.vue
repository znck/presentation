<script>
import Events from 'vue-global-events';
import User from '@/components/User';
import SurfaceSwitcher from '@/store/components/SurfaceSwitcher.vue';
import AdminRemoteConnection from '@/router/pages/admin/admin-remote-connection.vue';
import AdminSlideshowConnection from '@/router/pages/admin/admin-slideshow-connection.vue';
import AdminCallConnections from '@/router/pages/admin/admin-call-connections.vue';
import { createChannel } from '@/peer';
import { root, users, streams, surface } from '@/store/helpers';

const channel = createChannel(true);

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
  },
  async created() {
    await this.setup(channel);
    await this.setSurface('admin');
  },
  methods: {
    ...streams.methods,
    ...root.methods,
    ...surface.methods,
    async startPresenting() {
      const connection = await request.start();
    },
  },
  components: { User, SurfaceSwitcher, AdminRemoteConnection, AdminSlideshowConnection, Events, AdminCallConnections },
};
</script>

<template>
  <div :class="$.container">
    <SurfaceSwitcher />
    <Presentation />
    <Events @keydown.alt.80.exact="startPresenting" />
    <div :class="$.controls">
      <AdminRemoteConnection :id="id" />
      <AdminSlideshowConnection :id="id" />
      <AdminCallConnections :id="id" />
    </div>
  </div>
</template>

<style module="$">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 16px;
}
</style>