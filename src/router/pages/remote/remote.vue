<script>
import { root, surface, control } from '@/store/helpers';
import { createChannel } from '@/peer';
import { is, create } from '@/peer/standard';
import WaitScreen from './remote-wait-screen.vue';
import Controls from './remote-controls.vue';
import SyncVuex from '@/store/components/peer-sync-vuex.vue';

const channel = createChannel('remote');

export default {
  props: {
    /** Server ID */
    serverId: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
    },
  },

  data: () => ({
    isReady: false,
    isConnected: false,
    deviceId: channel.id,
  }),

  components: { WaitScreen, Controls, SyncVuex },

  methods: {
    ...root.methods,
    ...surface.methods,
  },

  computed: {
    zoom() {
      return Math.min(400, window.innerWidth) / window.innerWidth;
    },
  },

  async created() {
    this.setSurface('preview'); // displays current slide in <Presentation> component.

    const setup = async () => {
      // Connect to server.
      await channel.connect(this.serverId);
      // Request remote control access.
      await channel.sendMessage(this.serverId, create.request('remote', { secret: this.secret }));
    };

    this.$on(
      'hook:beforeDestroy',
      channel.onMessage((user, message) => {
        if (user.id === this.serverId) {
          if (is.disconnect(message) && message.payload === 'remote') {
            this.isConnected = false;
          }
        }
      })
    );

    // Reconnect on connection drop.
    this.$on(
      'hook:beforeDestroy',
      channel.onPeerLeave(async user => {
        if (this.serverId === user.id) {
          this.isConnected = false;
          while (true) {
            try {
              await Promise.race([
                setup(),
                new Promise((_, reject) => {
                  setTimeout(reject, 2000);
                }),
              ]);
              break;
            } catch {
              continue;
            }
          }
        }
      })
    );

    this.$on(
      'hook:beforeDestroy',
      channel.onMessage((user, message) => {
        if (this.serverId !== user.id) return;
        if (is.approve(message) && message.payload === 'remote') {
          this.isConnected = true;
        }
      })
    );

    await this.setup(channel);
    await setup();

    let meta = document.querySelector('meta[name="viewport"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      document.head.appendChild(meta);
    }

    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'
    );
  },
};
</script>

<template>
  <div :class="$.remote">
    <div :class="$.container" :style="{ transform: `scale(${zoom})`, height: `${100/zoom}vh` }">
      <template v-if="isConnected">
        <SyncVuex :from="serverId" :to="serverId" />
        <Presentation />
        <Controls />
      </template>
      <WaitScreen v-else :remoteId="deviceId" />
    </div>
  </div>
</template>

<style module="$">
/* Disables over-scroll on iOS. */
html,
body {
  position: fixed;
}

.remote {
  height: 100%;
  width: 100vw;
  max-width: 480px;
  background-color: black;
  touch-action: manipulation;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none;
  user-select: none;
  overflow: hidden;
}

.container {
  width: 100vw;
  transform-origin: top left;
}
</style>
