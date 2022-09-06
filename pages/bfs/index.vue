<template>
  <div class="bfs">
    <button @click="findPath(start, end)">start</button>
    <button @click="saveMap()">save map</button>
    <button @click="getMap()">get map</button>
    <button @click="resetMap()">reset map</button>
    <div :ref="el => mainEl = el" class="main">
      <div v-for="_, y in HEIGHT" :key="y">
        <div v-for="_, x in WIDTH" :key="`${x}_${y}`" inline-block w-5 h-5 bg-gray-7 bg-op-30 m-2px cursor-pointer
          hover:bg-op-80 :class="divClass(x, y)" @mousedown="mousedown = true" @mousemove="setWall(map, x, y)"
          @mouseup="mousedown = false">
          <span>{{ content(x, y) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
type Point = [number, number]
class Sorted {
  data: any;
  compare: any;
  constructor(data: Point[], compare: (a: Point, b: Point) => number) {
    this.data = data.slice()
    this.compare = compare || ((a: number, b: number) => a - b)
  }
  take () {
    if (!this.data.length) return
    // 记录最小值
    let min = this.data[0]
    // 记录最小值的索引
    let minIndex = 0
    // 开始比较数组里所有的值，找到更小的值，就记录为min
    // 同时记录最小值和最小值的位置
    for (let i = 1; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i]
        minIndex = i
      }
    }
    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()
    return min
  }
  give (value: Point) {
    this.data.push(value)
  }
  get length () {
    return this.data.length
  }
}
const mousedown = ref(false)
const WIDTH = ref(30)
const HEIGHT = ref(20)

const map = ref([])
const localMap = ref(null)
const start = [2, 2]
const end = [20, 15]
const content = (x: number, y: number) => {
  if (x === start[0] && y === start[1]) return 'S'
  if (x === end[0] && y === end[1]) return 'E'
  return map[y]?.[x] || ''
}

// 0 空地
// 1 扫描过的路
// 2 最终的路
// 3 墙壁
const divClass = (x: number, y: number) => {
  const cur = map.value[y]?.[x]
  if (cur === 1) return 'bg-orange'
  if (cur === 2) return 'bg-sky'
  if (cur === 3) return 'bg-red'
  if (cur) return 'bg-purple'
  return ''
}
const mainEl = ref()
const setWall = (map: Point[], x: number, y: number) => {
  if (mousedown.value) {
    console.log(x, y)
    console.log(map[y][x])
    map[y][x] = 3
    // setColor(x, y, 'purple')
    console.log(map)
  }
}
const saveMap = () => {
  localStorage.removeItem('map')
  localMap.value = useStorage('map', map.value)
  console.log(localMap.value)
}
const getMap = () => {
  const local = useStorage('map', map.value)
  local.value = local.value.map(v => v.map(item => item === 3 ? 3 : 0))
  map.value = local.value
}
const resetMap = () => {
  map.value = Array(HEIGHT.value).fill(0).map(v => Array(WIDTH.value).fill(0))
}

resetMap()

function sleep (t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
const findPath = async (start: Point, end: Point) => {
  const table = Array(HEIGHT.value).fill(0).map(v => Array(WIDTH.value).fill(0))
  const distance = (point: Point) => {
    return Math.abs(point[0] - end[0]) + Math.abs(point[1] - end[1])
    // return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
  }
  const queue = new Sorted([start], (a, b) => distance(a) - distance(b))
  async function insert (x: number, y: number, pre: Point) {
    // console.log(pre)
    // 越界
    if (x < 0 || x >= WIDTH.value || y < 0 || y >= HEIGHT.value || table[y][x] || map.value[y][x]) return
    await sleep(1)
    table[y][x] = pre
    console.log(map)
    map.value[y][x] = 1
    // setColor(x, y, 'orange')
    queue.give([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.take()
    // 到终点
    if (x === end[0] && y === end[1]) {
      let path = []
      while (x !== start[0] || y !== start[1]) {
        // [x, y] = table[y][x]
        let a = table[y][x][0]
        let b = table[y][x][1]
        x = a
        y = b
        path.push(map.value[y][x])
        await sleep(1)
        map.value[y][x] = 2
        console.log(map.value)
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
