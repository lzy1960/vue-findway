<template>
  <div class="bfs">
    <button @click="findPath(start, end)">
      start
    </button>
    <button @click="saveMap()">
      save map
    </button>
    <button @click="getMap()">
      get map
    </button>
    <button @click="resetMap()">
      reset map
    </button>
    <div :ref="el => mainEl = el" class="main">
      <div v-for="_, y in HEIGHT" :key="y" h-5>
        <div
          v-for="__, x in WIDTH" :key="`${x}_${y}`" inline-block w-5 h-5 bg-gray-7 bg-op-30 vertical-top text-center
          cursor-pointer border border-dark hover:bg-op-80 :class="divClass(x, y)"
          @mousedown="mousedown = true; setWall(map, x, y)" @mousemove="setWall(map, x, y)"
          @contextmenu.prevent="delCurWall(map, x, y)" @mouseup="mousedown = false"
        >
          {{ content(x, y) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

// types
type Point = [number, number]

class Sorted {
  data: Point[]
  compare: any
  constructor (data: Point[], compare: (a: Point, b: Point) => number) {
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

// constant
const WIDTH = ref(30)
const HEIGHT = ref(20)
const DEFAULT_MAP: () => Point[][] = () => Array(HEIGHT.value).fill(0).map(v => Array(WIDTH.value).fill(0))


// used variable
const map = ref([])
const start: Point = [2, 2]
const end: Point = [20, 15]
const mousedown = ref(false)
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

// wall methods
const setWall = (map: Point[], x: number, y: number) => {
  if (mousedown.value) {
    map[y][x] = 3
  }
}
const delCurWall = (map: Point[], x: number, y: number) => {
  map[y][x] = 0
}

// map methods
const saveMap = () => {
  localStorage.removeItem('map')
  useStorage('map', map.value)
}
const getMap = () => {
  const local = useStorage('map', map.value)
  local.value = local.value.map(v => v.map(item => item === 3 ? 3 : 0))
  map.value = local.value
}
const resetMap = () => {
  map.value = DEFAULT_MAP()
}
const setCurValue = (x: number, y: number, value: number) => {
  map.value[y][x] = value
}

// resetMap when init
resetMap()

// delay to debug
function sleep (t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t)
  })
}

// A* find way
const findPath = async (start: Point, end: Point) => {
  const table = DEFAULT_MAP()
  const distance = (point: Point) => {
    return Math.abs(point[0] - end[0]) + Math.abs(point[1] - end[1])
    // return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
  }
  const queue = new Sorted([start], (a, b) => distance(a) - distance(b))
  async function insert (x: number, y: number, pre: Point) {
    // 越界
    if (x < 0 || x >= WIDTH.value || y < 0 || y >= HEIGHT.value || table[y][x] || map.value[y][x]) return
    await sleep(1)
    table[y][x] = pre
    setCurValue(x, y, 1)
    queue.give([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.take()
    // 到终点
    if (x === end[0] && y === end[1]) {
      let path = []
      while (x !== start[0] || y !== start[1]) {
        // [x, y] = table[y][x]
        let [a, b] = table[y][x] as Point
        x = a
        y = b
        path.push(map.value[y][x])
        await sleep(1)
        setCurValue(x, y, 2)
      }
      return path
    }
    const cur: Point = [x, y]
    await insert(x, y - 1, cur)
    await insert(x, y + 1, cur)
    await insert(x - 1, y, cur)
    await insert(x + 1, y, cur)
  }
  return null
}
</script>

<style lang='scss' scoped>
</style>
