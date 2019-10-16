<template>
  <div
    :class="[$.container, $['slide' + current]]"
    @mousedown.stop.left="current += 1"
  >
    <slot :name="current"></slot>
  </div>
</template>

<script>
export default {
  data: () => ({
    current: 0,
  }),
}
</script>

<style module="$">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10vw;
  width: 50vw;
  height: 28vw;
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