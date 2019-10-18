<script>
import { mapGetters, mapState } from 'vuex';
import BrownianMotion from './brownian-motion.vue';

export default {
  computed: {
    ...mapGetters('users', { users: 'onlineUsers' }),
    // users() {
    //   const users = []

    //   for (let i = 0; i < 50; ++i) {
    //     users.push({
    //       id: `${i}`,
    //       name: `User ${i}`,
    //       email: `user${i}@example.com`,
    //       role: 'audience',
    //       status: 'online'
    //     })
    //   }

    //   return users;
    // },
    ...mapState(['serverId']),
    url() {
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : port}/audience?id=${this.serverId}`;
    },
  },
  components: { BrownianMotion }
};
</script>

<template>
  <div :class="$.join">
    <QRCode :content="url" size="28vw" />
    <p>Scan &amp; Join the presentation!</p>

    <BrownianMotion v-for="user of users" :key="user.id">
      <User v-bind="user" hide />
    </BrownianMotion>
  </div>
</template>

<style module="$">
.join {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>