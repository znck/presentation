<script>
export default {
  data: () => ({
    counter: 0,
  }),
};
</script>

<template>
  <div :class="$.counter">
    <button @click="counter--">-</button>
    <div>{{ counter }}</div>
    <button @click="counter++">+</button>
  </div>
</template>

<style module="$">
.counter {
  display: flex;
  border: 0.125vw solid black;
  border-radius: 4vw;
}

.counter button {
  padding: 1vw 3vw;
  font-size: 4vw;
  cursor: pointer;
  border: none;
}

.counter button:focus {
  outline: none;
}

.counter button:active {
  background: black;
  color: white;
}

.counter button:first-child {
  border-right: 0.125vw solid black;
  border-top-left-radius: 4vw;
  border-bottom-left-radius: 4vw;
}

.counter button:last-child {
  border-left: 0.125vw solid black;
  border-top-right-radius: 4vw;
  border-bottom-right-radius: 4vw;
}

.counter div {
  padding: 1vw 2vw;
  width: 10vw;
  font-size: 4vw;
}
</style>