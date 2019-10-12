<script>
import { root, surface, control } from '@/store/helpers';
import { createChannel } from '@/peer';
import { is, create } from '@/peer/standard';
import WaitScreen from './remote-wait-screen.vue';
import Controls from './remote-controls.vue';
import RemoteSyncControl from './remote-sync-control.vue';

const channel = createChannel('remote');

export default {
  props: {
    /** Server ID */
    serverId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isReady: false,
    isConnected: false,
    deviceId: channel.id,
  }),

  components: { WaitScreen, Controls, RemoteSyncControl },

  methods: {
    ...root.methods,
    ...surface.methods,
  },

  async created() {
    this.setSurface('preview'); // displays current slide in <Presentation> component.

    const setup = async () => {
      // Connect to server.
      await channel.connect(this.serverId);
      // Request remote control access.
      await channel.sendMessage(this.serverId, create.request('remote'));
    };

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
    <template v-if="isConnected">
      <RemoteSyncControl :target="serverId" />
      <div :class="$.container">
        <Presentation />
        <Controls />
      </div>
    </template>
    <WaitScreen v-else :remoteId="deviceId" />
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
  background-color: black;
  touch-action: manipulation;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none;
  user-select: none;
}

.container {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 2fr;
  padding: 16px;
  max-height: 100%;
}

.container > *:nth-of-type(1) {
  grid-area: 1/1/2/2;
}

.container > *:nth-of-type(2) {
  grid-area: 2/1/3/2;
}
</style>
