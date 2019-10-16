<script>
export default {
  data: () => ({
    x: Math.random(),
    y: Math.random(),
    speed: [0.0001 * Math.random() , 0.0001 * Math.random()]
  }),
  mounted() {
    let t = Date.now();
    const interval = setInterval(() => {
      const nextT = Date.now();
      const dT = nextT - t;

      const nextX = this.x + this.speed[0] * dT;
      const nextY = this.y + this.speed[1] * dT;

      if (nextX >= 1 || nextX <= 0 || (nextX > 0.32 && nextX < 0.72)) {
        this.speed[0] = -this.speed[0];
      }

      if (nextY >= 1 || nextY <= 0 || (nextX > 0.25 && nextX < 0.75)) {
        this.speed[1] = -this.speed[1];
      }

      this.x = Math.min(Math.max(0, nextX), 1);
      this.y = Math.min(Math.max(0, nextY), 1);

      t = nextT;
    }, 100);
    this.$on('hook:beforeDestroy', () => clearInterval(interval));
  },
};
</script>

<template>
  <div :class="$.motion" :style="{ top: y * 100 + '%', left: x * 100 + '%' }">
    <slot />
  </div>
</template>

<style module="$">
.motion {
  transition: all ease 0.3s;
  position: absolute;
}
</style>