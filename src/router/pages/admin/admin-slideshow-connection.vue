<script>
import { slideshows, root, streams, users } from '@/store/helpers';
import QRCode from '@/components/QRCode.vue';
import SyncVuex from '@/store/components/peer-sync-vuex.vue';

let stream = null
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
      isSharingStream: false,
    };
  },
  computed: {
    ...slideshows.computed,
    ...users.computed,
    slideshowURL() {
      const id = this.id;
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : ''}/?id=${id}&secret=${this.secret}`;
    },
  },
  methods: {
    ...slideshows.methods,
    ...root.methods,
    ...streams.methods,
    getUser() {
      const id = this.slideshowId;
      const user = this.users.find(user => id === user.id);

      return user;
    },
    async shareScreen() {
      const user = this.getUser();

      if (!user) return;

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      this.isSharingStream = true;

      stream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true });

      await this.call({ user, stream, meta: { streamType: 'fullscreen' } });
    },
    async stopSharing() {
      if (!this.isSharingStream) return;
      const user = this.getUser();

      if (!user) return;

      await this.endCall({ user });
      
      if (stream) { 
        stream.getTracks().forEach(track => track.stop());
      }
      
      this.prevStream = null;
      this.isSharingStream = false;
    },
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
    <template v-if="slideshowId">
      <SyncVuex :to="slideshowId" key="sync" />
      {{ slideshowId }}
      <button @click="setActiveSlideshow(null)">disconnect</button>
      <button @click="shareScreen" v-if="!isSharingStream">share screen</button>
      <button @click="stopSharing" v-else>stop sharing screen</button>
    </template>

    <ul v-else>
      <QRCode :content="slideshowURL" size="30vw" />
      <pre>{{ slideshowURL }}</pre>

      <li v-for="slideshow in slideshows" :key="slideshow">
        {{ slideshow.substr(slideshow.length - 4 ) }}
        <button
          type="button"
          @click="setActiveSlideshow(slideshow)"
        >Allow</button>
      </li>
    </ul>

    <button type="button" @click="isExpanded = false">close</button>
  </div>
  <div v-else :class="$.container">
    <template v-if="slideshowId">
      <SyncVuex :to="slideshowId" key="sync" />
      <button @click="isExpanded = true" :class="$.button" data-icon>
        <img src="@/assets/slideshow.svg" />
      </button>
    </template>
    <button @click="isExpanded = true" v-else :class="$.button" data-icon>
      <img src="@/assets/slideshow.svg" />
    </button>
  </div>
</template>

<style module="$">
.container {
  display: inline-block;
}

.expanded {
  display: unset;
  background: white;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40vw;
  border-radius: 0;
  padding: 16px;
}

.container ul {
  list-style: none;
  padding-left: 0;
}

.button {
  border: 1px solid;
  border-radius: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  margin-right: 0.25rem;
}

.button:focus {
  outline: none;
}

.button img {
  width: 1.5rem;
}

</style>

