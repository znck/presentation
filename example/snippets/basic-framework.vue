<template>
  <div 
    @keydown.arrow-right="current += 1"
    @keydown.arrow-left="current -= 1"
  >
    <slot :name="current" />
  </div>
</template>

<script>
export default {
  data: () => ({
    current: 0,
  }),
}
</script>
