<template>
  <div>
    <div :class="[$.container, $.slide0]">
      <slot name="0" />
    </div>
    <div :class="[$.container, $.slide1]">
      <slot name="1" />
    </div>
    <div :class="[$.container, $.slide2]">
      <slot name="2" />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    current: 0,
  }),
};
</script>

<style module="$">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5vw;
  width: 25vw;
  height: 14vw;
  background: black;
  user-select: none;
  transition: background-color ease-in 150ms;
}

.slide0 {
  background: lightcoral;
}

.slide1 {
  background: lightgreen;
}

.slide2 {
  background: lightblue;
}
</style>