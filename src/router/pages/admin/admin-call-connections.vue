<script>
import { streams } from '@/store/helpers';
import User from '@/components/User.vue';

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
    };
  },

  computed: {
    ...streams.computed,
    audienceURL() {
      const id = this.id;
      const { protocol, hostname, port } = window.location;

      return `${protocol}//${hostname}${port ? ':' + port : ''}/audience?id=${id}`;
    },
  },
  methods: streams.methods,
  components: { User }
};
</script>

<template>
  <div v-if="isExpanded" :class="[$.container, $.expanded]">
    <pre>{{ audienceURL }}</pre>

    <ul>
      <li v-for="call in activeCalls" :key="call.user.id">
        <User v-bind="call.user">
          <button @click="acceptCall(call)">✅</button>
          <button @click="endCall(call)">❌</button>
        </User>
      </li>
    </ul>

    <button @click="isExpanded = false">close</button>
  </div>
  <div v-else :class="$.container">
    <button @click="isExpanded = true" :class="$.button" data-icon>
      <img src="@/assets/users.svg" />
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
}

.button:focus {
  outline: none;
}

.button img {
  width: 1.5rem;
}
</style>
