<script setup lang="ts">
interface PropsType {
  height_vh?: number;
}

const { height_vh } = defineProps<PropsType>();
</script>

<template>
  <div class="row items-center justify-center hc" :style="`height: ${height_vh || 100}vh;`">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss">
.loader {
  width: 40px;
  aspect-ratio: 1;
  --c: no-repeat linear-gradient(#000 0 0);
  background:
    var(--c) 0% 50%,
    var(--c) 50% 50%,
    var(--c) 100% 50%;
  background-size: 20% 100%;
  animation: l1 1s infinite linear;
}
@keyframes l1 {
  0% {
    background-size:
      20% 100%,
      20% 100%,
      20% 100%;
  }
  33% {
    background-size:
      20% 10%,
      20% 100%,
      20% 100%;
  }
  50% {
    background-size:
      20% 100%,
      20% 10%,
      20% 100%;
  }
  66% {
    background-size:
      20% 100%,
      20% 100%,
      20% 10%;
  }
  100% {
    background-size:
      20% 100%,
      20% 100%,
      20% 100%;
  }
}
</style>
