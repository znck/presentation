<script>
import { remotes } from '@/store/helpers';
import RemoteSyncControl from '@/router/pages/remote/remote-sync-control.vue';

export default {
  computed: remotes.computed,
  methods: remotes.methods,
  components: { RemoteSyncControl },
};
</script>

<template>
  <div v-if="remoteId">
    <RemoteSyncControl :target="remoteId" />
  </div>
  <div v-else>
    <ul>
      <li v-for="remote in remotes" :key="remote">
        {{ remote.substr(remote.length - 4 ) }}
        <button
          type="button"
          @click="setActiveRemote(remote)"
        >Allow</button>
      </li>
    </ul>
  </div>
</template>

<style>
</style>