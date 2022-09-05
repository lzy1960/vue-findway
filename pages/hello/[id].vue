<template>
  <div class="hello" text-lg font-bold>
    <div>{{ $route.params.id }}</div>
    <NuxtLink btn m-3 text-lg to="/">
      Back
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang='scss' scoped>
</style>
