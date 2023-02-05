<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const layout = 'default'
</script>

<style lang="scss">
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0
}

html.dark {
  background-color: #222;
  color: white;
}

* {
  -webkit-touch-callout: none;
  /*系统默认菜单被禁用*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -khtml-user-select: none;
  /*早期浏览器*/
  -moz-user-select: none;
  /*火狐*/
  -ms-user-select: none;
  /*IE10*/
  user-select: none;
}

input {
  user-select: auto;
  /*webkit浏览器*/
}

textarea {
  user-select: auto;
  /*webkit浏览器*/
}
</style>
