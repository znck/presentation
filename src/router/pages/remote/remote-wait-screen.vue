<!-- This component displays a wait screen. -->

<script>
export default {
  props: {
    remoteId: {
      type: String,
      required: true,
    },
  },

  computed: {
    deviceId() {
      return this.remoteId.substr(this.remoteId.length - 4);
    },
  },
};
</script>

<template>
  <section :class="$.container">
    <h2 role="banner" :aria-label="`The unique device ID is ${deviceId}`" :class="$.deviceId">
      <div :class="$.ripple" aria-hidden="true">
        <div></div>
        <div></div>
      </div>
      {{ deviceId }}
    </h2>
    <footer :class="$.waitNote">
      <pre>Connecting to server</pre>
    </footer>
  </section>
</template>

<style module="$">
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 75% auto;
  height: 100%;
  text-transform: uppercase;
}

.deviceId {
  grid-area: 1 / 1 / 2 / 2;
  font-size: 25vw;
  color: white;
  margin-block-start: 0;
  margin-block-end: 0;
  text-align: center;
  align-self: center;
  position: relative;
}

.waitNote {
  grid-area: 2 / 1 / 3 / 2;
  font-size: 14px;
  color: #fafafa;
  text-align: center;
  align-self: center;
}

.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(6);
  width: 54px;
  height: 54px;
  opacity: 0.5;
}

.ripple div {
  position: absolute;
  border: 1px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.ripple div:nth-child(2) {
  animation-delay: -1s;
}

@keyframes ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>