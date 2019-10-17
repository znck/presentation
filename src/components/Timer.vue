<script>
export default {
  inject: ['config'],

  data() {
    return {
      startedAt: null,
      now: Date.now(),
    };
  },

  computed: {
    limit() {
      return this.config ? this.config.timer : 30;
    },
    remaining() {
      let t = Math.floor(
        this.startedAt !== null ? this.limit * 60 - (this.now - this.startedAt) / 1000 : this.limit * 60
      );
      const h = Math.floor(t / 3600);
      t = t % 3600;
      const m = Math.floor(t / 60);
      t = t % 60;
      const s = Math.floor(t);
      const pad = n => (n < 10 ? `0${n}` : n);

      return pad(h) + ':' + pad(m) + ':' + pad(s);
    },
  },

  methods: {
    start() {
      this.startedAt = this.now = Date.now();

      window.setInterval(() => {
        this.now = Date.now();
      }, 500);
    },
  },
};
</script>

<template>
  <div :class="$.container">
    <div>{{ remaining }}</div>
    <button v-if="startedAt === null" @click="start">Start</button>
  </div>
</template>

<style module="$">
.container {
  color: rgba(255, 255, 255, 0.87);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 92px;
  height: 100%;
  padding-bottom: 24px;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-weight: bold;
}

.container button {
  border: 1px solid;
  background: white;
  color: black;
  padding: 0.5em 1em;
  cursor: pointer;
}
.container button:focus {
  outline: none;
}
.container button:not([data-icon]):active {
  background: black;
  color: white;
}
</style>