<script>
const box = [0.35, 0.615, 0.19, 0.68];

function inBox({ x, y }) {
  return box[0] <= x && x <= box[1] && box[2] <= y && y <= box[3];
}

function inX(x) {
  return box[0] <= x && x <= box[1];
}

function inY(y) {
  return box[2] <= y && y <= box[3];
}

function random(a, b) {
  return Math.random() * (b - a) + a;
}

export default {
  data: () => ({
    x: 0.5,
    y: 0,
    speed: [random(-10, 10), random(-10, 10)].map(v => v * 0.00001),
  }),
  mounted() {
    let t = Date.now();
    const interval = setInterval(() => {
      const nextT = Date.now();
      const dT = nextT - t;

      const nextX = this.x + this.speed[0] * dT;
      const nextY = this.y + this.speed[1] * dT;

      if (nextX >= 0.97 || nextX <= 0) {
        this.speed[0] = -this.speed[0];
      }

      if (inBox({ x: nextX, y: nextY })) {
        if (inX(this.x)) {
          this.speed[1] = -this.speed[1];
        } else if (inY(this.y)) {
          this.speed[0] = -this.speed[0];
        } else {
          this.speed[1] = -this.speed[1];
          this.speed[0] = -this.speed[0];
        }
      }

      if (nextY >= 0.96 || nextY <= 0) {
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