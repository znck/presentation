<script>
import { remotes, root } from '@/store/helpers';
import QRCode from '@/components/QRCode.vue';
import SyncVuex from '@/store/components/peer-sync-vuex.vue';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isExpanded: false,
      secret: null,
    };
  },
  computed: {
    ...remotes.computed,
    remoteURL() {
      const id = this.id;
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : ''}/remote?id=${id}&secret=${this.secret}`;
    },
  },
  methods: {
    ...remotes.methods,
    ...root.methods,
  },
  components: { SyncVuex, QRCode },
  async created() {
    const channel = await this.channel();

    this.secret = channel.secret;
  },
};
</script>

<template>
  <div v-if="isExpanded" :class="[$.container, $.expanded]">
    <!-- TODO: Use click away -->
    <template v-if="remoteId">
      <SyncVuex :from="remoteId" :to="remoteId" key="sync" />
      {{ remoteId }}
      <button @click="setActiveRemote(null)">disconnect</button>
    </template>

    <ul v-else>
      <QRCode :content="remoteURL" size="30vw" />
      <pre>{{ remoteURL }}</pre>

      <li v-for="remote in remotes" :key="remote">
        {{ remote.substr(remote.length - 4 ) }}
        <button
          type="button"
          @click="setActiveRemote(remote)"
        >Allow</button>
      </li>
    </ul>

    <button type="button" @click="isExpanded = false">close</button>
  </div>
  <div v-else :class="$.container">
    <template v-if="remoteId">
      <SyncVuex :from="remoteId" :to="remoteId" key="sync" />
      <button @click="isExpanded = true">✅</button>
    </template>
    <button @click="isExpanded = true" v-else>📴</button>
  </div>
</template>

<style module="$">
.container {
  background: white;
}
.expanded {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40vw;
  border-radius: 0;
}

.container ul {
  list-style: none;
  padding-left: 0;
}
</style>
