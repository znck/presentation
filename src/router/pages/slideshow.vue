<script>
import SurfaceSwitcher from "@/store/components/SurfaceSwitcher";
import ReceiveControlCommands from "@/store/components/ReceiveControlCommands.vue";
import { root } from "@/store/helpers";
import { createChannel } from "@/peer";

export default {
  props: {
    id: String,
  },
  data() {
    return { isRemoteControlled: false };
  },
  components: { SurfaceSwitcher, ReceiveControlCommands },

  methods: root.methods,
  async created() {
    if (this.id) {
      const channel = createChannel(false);

      channel.setName("Slideshow Target")

      channel.onPeerLeave(async user => {
        if (this.id === user.id) {
          await channel.connect(this.id);
          await channel.sendMessage(this.id, "@vs/request-second-screen");
        }
      })

      await this.setup(channel);
      await channel.connect(this.id);
      await channel.sendMessage(this.id, "@vs/request-second-screen");
      this.isRemoteControlled = true;
    }
  },
};
</script>

<template>
  <div :class="$.slideshow">
    <Presentation />
    <SurfaceSwitcher />
    <ReceiveControlCommands v-if="isRemoteControlled" :from="id" />
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