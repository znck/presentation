<script>
import SurfaceSwitcher from '@/store/components/SurfaceSwitcher';
import SyncVuex from '@/store/components/peer-sync-vuex.vue';
import DisplayStream from './slideshow-display-stream.vue'
import { root } from '@/store/helpers';
import { createChannel, create } from '@/peer';

export default {
  props: {
    id: String,
    secret: String,
  },
  data() {
    return { isRemoteControlled: false };
  },
  components: { SurfaceSwitcher, SyncVuex, DisplayStream },

  methods: root.methods,
  async created() {
    if (this.id) {
      const channel = createChannel(false);

      channel.setName('Slideshow Target');
      channel.setRole('slideshow');
      this.$store.commit('SET_SERVER_ID', this.id);

      if (this.secret) channel.secret = this.secret;

      channel.onPeerLeave(async user => {
        if (this.id === user.id) {
          await channel.connect(this.id);
          await channel.sendMessage(this.id, create.request('slideshow', { secret: this.secret }));
        }
      });

      this.$on(
        'hook:beforeDestroy',
        channel.onMessage((user, message) => {
          if (user.id === this.serverId) {
            if (is.disconnect(message) && message.payload === 'slideshow') {
              this.isRemoteControlled = false;
            }
          }
        })
      );

      await this.setup(channel);
      await channel.connect(this.id);
      await channel.sendMessage(this.id, create.request('slideshow', { secret: this.secret }));
      this.isRemoteControlled = true;
    }
  },
};
</script>

<template>
  <div :class="$.slideshow">
    <Presentation />
    <SurfaceSwitcher />
    <SyncVuex v-if="isRemoteControlled" :from="id" />
    <DisplayStream v-if="isRemoteControlled" />
  </div>
</template>

<style module="$">
.slideshow {
  min-height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
}
</style>