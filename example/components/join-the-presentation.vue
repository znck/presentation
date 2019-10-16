<script>
import { mapGetters, mapState } from 'vuex';
import BrownianMotion from './brownian-motion.vue';

export default {
  computed: {
    // ...mapGetters('users', { users: 'onlineUsers' }),
    users() {
      return [
        { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
        { id: '2', name: 'John Doe', email: 'john@example.com' },
      ]
    },
    ...mapState(['serverId']),
    url() {
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : port}/admin?id=${this.serverId}`;
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
      <User v-bind="user" />
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