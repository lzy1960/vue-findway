<template>
  <div class="bfs">
    <button @click="path(map, start, end)">start</button>
    <div v-for="y in 20" :key="y">
      <div :ref="el => curEl = el" v-for="x in 30" :key="x" inline-block w-5 h-5 bg-gray-7 bg-op-30 m-2px cursor-pointer
        hover:bg-op-80>
        <span>{{ isHighlight(x, y) ? 'x' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const WIDTH = 30
const HEIGHT = 20
const map = Array(HEIGHT).fill(0).map(v => Array(WIDTH).fill(0))
const start = [2, 2]
const end = [10, 10]
const isHighlight = (x, y) => {
  const isStart = x === start[0] && y === start[1]
  const isEnd = x === end[0] && y === end[1]
  return isStart || isEnd
}
const curEl = ref()
function sleep (t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
const path = async (map: number[][], start: number[], end: number[]) => {
  console.log(start)
  const queue = [start]
  async function insert (x: number, y: number) {
    // 越界
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return
    await sleep(1)
    map[y][x] = 1
    queue.push([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.shift()
    console.log(queue)
    console.log(x, y)
    console.log(curEl)
    curEl.value.style.backgroundColor = '#f00'
    // 到终点
    if (x === end[0] && y === end[1]) return true
    await insert(x, y - 1)
    await insert(x, y + 1)
    await insert(x - 1, y)
    await insert(x + 1, y)
  }
  return false
}
// console.log(path(map, start.value, end.value))
</script>

<style lang='scss' scoped>
</style>
