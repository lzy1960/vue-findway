<template>
  <div class="bfs">
    <button @click="path(map, start, end)">start</button>
    <div v-for="_, y in HEIGHT" :key="y">
      <div v-for="_, x in WIDTH" :key="`${x}_${y}`" inline-block w-5 h-5 bg-gray-7 bg-op-30 m-2px cursor-pointer
        hover:bg-op-80 :class="map[y]?.[x] === 1 ? 'bg-red' : ''">
        <span>{{ map[y]?.[x] }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const WIDTH = ref(30)
const HEIGHT = ref(20)
const map = ref(Array(HEIGHT.value).fill(0).map(v => Array(WIDTH.value).fill(0)))
const start = [2, 2]
const end = [10, 10]
function sleep (t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
const path = async (map, start: number[], end: number[]) => {
  const queue = [start]
  async function insert (x: number, y: number) {
    // 越界
    if (x < 0 || x >= WIDTH.value || y < 0 || y >= HEIGHT.value || map[y]?.[x] === 1) return
    await sleep(1)
    map[y][x] = 1
    queue.push([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.shift()
    // 到终点
    if (x === end[0] && y === end[1]) return true
    await insert(x, y - 1)
    await insert(x, y + 1)
    await insert(x - 1, y)
    await insert(x + 1, y)
  }
  return false
}
</script>

<style lang='scss' scoped>
</style>
