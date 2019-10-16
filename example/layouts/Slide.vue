<script>
export default {
  inject: ['config'],
  computed: {
    title() {
      return this.config.shortTitle;
    },
    conference() {
      return this.config.description;
    },
    twitter() {
      return this.config.twitter;
    },
  },
};
</script>

<template>
  <div class="slide">
    <slot />

    <aside class="info">
      <h1 class="author mono">{{ twitter }}</h1>
      <h2 class="subtitle">{{ conference }}</h2>
      <h3 class="title">{{ title }}</h3>
    </aside>
  </div>
</template>

<style scoped>
.slide {
  position: relative;
  padding: 2vw;
  text-align: center;
}

.info {
  position: absolute;
  bottom: 0.5vw;
  right: 0.5vw;
  text-align: right;
}

.info .title {
  font-size: 1vw;
  color: rgba(0, 0, 0, 0.87);
}

.info .subtitle {
  font-size: 0.85vw;
  color: rgba(0, 0, 0, 0.54);
}

.info .author {
  font-size: 1.75vw;
  color: var(--color-secondary);
}
</style>
