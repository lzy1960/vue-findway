<template>
  <div class="bfs">
    <button @click="findPath(map, start, end)">start</button>
    <div :ref="el => containerEl = el" class="container">
      <div v-for="_, y in HEIGHT" :key="y">
        <div v-for="_, x in WIDTH" :key="`${x}_${y}`" inline-block w-5 h-5 bg-gray-7 bg-op-30 m-2px cursor-pointer
          hover:bg-op-80 :class="map[y]?.[x] ? 'bg-red' : ''">
          <span>{{ map[y]?.[x] ? 'x' : '' }}</span>
        </div>
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
const containerEl = ref()
function sleep (t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
const findPath = async (map, start: number[], end: number[]) => {
  const table = Object.create(map)
  const queue = [start]
  async function insert (x: number, y: number, pre) {
    // console.log(pre)
    // 越界
    if (x < 0 || x >= WIDTH.value || y < 0 || y >= HEIGHT.value || table[y][x]) return
    await sleep(1)
    table[y][x] = pre
    queue.push([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.shift()
    // 到终点
    if (x === end[0] && y === end[1]) {
      let path = []
      while(x !== start[0] || y !== start[1]) {
        console.log(map[y][x])
        console.log(table)
        console.log(path)
        // [x, y] = table[y][x]
        x = table[y][x][0]
        y = table[y][x][1]
        path.push(map[y][x])
        await sleep(1)
        // map[b][a] = 1
        containerEl.value.children[y].children[x].style.backgroundColor = 'skyblue'
      }
      return path
    }
    await insert(x, y - 1, [x, y])
    await insert(x, y + 1, [x, y])
    await insert(x - 1, y, [x, y])
    await insert(x + 1, y, [x, y])
  }
  return null
}
</script>

<style lang='scss' scoped>
</style>
