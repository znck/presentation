<script>
import Slide from "./slide.vue";

export default {
  components: { Slide },
};
</script>

<template>
  <VS :aspectRatio="16/9">
    <template #0>
      <Slide>
        <h1>Slide 1</h1>
      </Slide>
    </template>

    <template #notes.0>
      <h1>This is now</h1>
      <p>Or this is never!</p>
    </template>

    <template #1>
      <Slide>
        <h1>Slide 2</h1>
      </Slide>
    </template>

    <template #notes.1>
      <h1>This is Slide 2</h1>
      <p>Or Next is slide 3!</p>
    </template>

    <template #2>
      <Slide>
        <h1>Slide 3</h1>
      </Slide>
    </template>

    <template #3>
      <Slide>
        <h1>Slide 4</h1>
      </Slide>
    </template>

    <template #4>
      <Slide>
        <h1>Slide 5</h1>
      </Slide>
    </template>

    <template #5>
      <Slide>
        <h1>Slide 6</h1>
      </Slide>
    </template>

    <template #6>
      <Slide>
        <h1>Slide 7</h1>
      </Slide>
    </template>
    
    <template #7>
      <Slide>
        <h1>Slide 8</h1>
      </Slide>
    </template>
    
    <template #8>
      <Slide>
        <h1>Slide 9</h1>
      </Slide>
    </template>
    
    <template #9>
      <Slide>
        <h1>Slide 10</h1>
      </Slide>
    </template>
  </VS>
</template>

<style>
.slide h1 {
  font-size: 10vw;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

body {
  height: 100vh;
}
</style>
