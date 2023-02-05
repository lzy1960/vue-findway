<template>
  <div class="bfs">
    <div
      class="control"
      mb-2
    >
      <button
        btn
        mx-1
        @click="findPath(start, end)"
      >
        <div
          btn-icon
          i-carbon-play
        />
        Start
      </button>
      <button
        btn
        mx-1
        @click="saveMap()"
      >
        <div
          btn-icon
          i-carbon-save
        />
        Save Map
      </button>
      <button
        btn
        mx-1
        @click="getMap()"
      >
        <div
          btn-icon
          i-carbon-arrow-down
        />
        Get Map
      </button>
      <button
        btn
        mx-1
        @click="resetMap()"
      >
        <div
          btn-icon
          i-carbon-restart
        />
        Reset Map
      </button>
    </div>
    <div
      class="debug-control"
      mb-1
    >
      <span mr-1>Width</span>
      <input
        v-model="width"
        type="number"
        :step="10"
        :min="10"
        :max="200"
      >
      <span
        mr-1
        ml-4
      >Height</span>
      <input
        v-model="height"
        type="number"
        :step="10"
        :min="10"
        :max="200"
      >
      <span
        mr-1
        ml-4
      >Delay</span>
      <input
        v-model="delay"
        type="number"
        :step="200"
        :min="10"
        :max="3000"
        :disabled="!isDebug"
      >
      <button
        btn
        mx-1
        bg-gray
        :class="isDebug ? 'bg-red' : ''"
        @click="isDebug = !isDebug"
      >
        <div
          btn-icon
          i-carbon-debug
        />
        Debug Status
      </button>
    </div>
    <div class="position-control">
      <button
        btn
        mx-1
        :class="isSettingStart ? '' : 'bg-gray'"
        @click="toggleSetPointStatus('start')"
      >
        <div
          btn-icon
          i-carbon-battery-full
        />
        Set Start Point
      </button>
      <button
        btn
        mx-1
        :class="isSettingEnd ? '' : 'bg-gray'"
        @click="toggleSetPointStatus('end')"
      >
        <div
          btn-icon
          i-carbon-battery-empty
        />
        Set End Point
      </button>
      <button
        btn
        mx-1
        :class="!isSettingStart && !isSettingEnd ? '' : 'bg-gray'"
        @click="toggleSetPointStatus('wall')"
      >
        <div
          btn-icon
          i-carbon-assembly-cluster
        />
        Make Walls
      </button>
    </div>
    <Legends />
    <div
      :ref="el => mainEl = el"
      class="main"
      mt-5
    >
      <div
        v-for="_, y in height"
        :key="y"
      >
        <div
          v-for="__, x in width"
          :key="`${x}_${y}`"
          inline-block
          w-5
          h-5
          bg-gray-7
          bg-op-30
          vertical-top
          text-center
          cursor-pointer
          border
          border-dark
          text-sm
          hover:bg-op-80
          transition-200
          :class="divClass(x, y)"
          @mousedown="mousedown = true; setDiv(x, y)"
          @mousemove="setWall(x, y)"
          @contextmenu.prevent="delCurWall(x, y)"
          @mouseup="mousedown = false"
        >
          {{ content (x, y) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'
import { Ref } from 'vue'

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
    // 开始比较数组里所有的值，找到更小的值，就记录为 min
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
const DEFAULT_MAP: () => Point[][] = () => Array(height.value).fill(0).map(v => Array(width.value).fill(0))


// used variable
const isSettingStart = ref(false)
const isSettingEnd = ref(false)
const isDebug = ref(true)
const delay = ref(10)
const width = ref(30)
const height = ref(20)
const map = ref([]) as Ref<number[][]>
const start: Ref<Point> = ref([2, 2] as Point)
const end: Ref<Point> = ref([20, 15] as Point)
const mousedown = ref(false)
const isStart = (x: number, y: number) => x === start.value[0] && y === start.value[1]
const isEnd = (x: number, y: number) => x === end.value[0] && y === end.value[1]
const content = (x: number, y: number) => {
  if (isStart(x, y)) return 'S'
  if (isEnd(x, y)) return 'E'
  if (map.value[y]?.[x] === 1) return '·'
  if (map.value[y]?.[x] === 3) return '×'
  return ''
}
const isMakingWalls = computed(() => {
  return !isSettingStart.value && !isSettingEnd.value
})

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
const setWall = (x: number, y: number) => {
  if (isStart(x, y) || isEnd(x, y) || !isMakingWalls.value) return
  if (mousedown.value) {
    setCurValue(x, y, 3)
  }
}
const delCurWall = (x: number, y: number) => {
  setCurValue(x, y, 0)
}

// map methods
const saveMap = () => {
  localStorage.removeItem('map')
  useStorage('map', map.value)
  useStorage('width', width)
  useStorage('height', height)
  alert('save to localStorage')
}
const getMap = () => {
  const localMap = useStorage('map', map.value)
  localMap.value = localMap.value.map(v => v.map(item => item === 3 ? 3 : 0))
  map.value = localMap.value
  const localWidth = useStorage('width', width.value)
  width.value = +localWidth.value
  const localHeight = useStorage('height', height.value)
  height.value = +localHeight.value
}
const resetMap = () => {
  map.value = DEFAULT_MAP()
}
const setCurValue = (x: number, y: number, value: number) => {
  if (!map.value[y]) {
    map.value[y] = []
  }
  map.value[y][x] = value
}

// set point methods
const toggleSetPointStatus = (type: string) => {
  switch (type) {
    case 'start':
      isSettingStart.value = !isSettingStart.value
      isSettingEnd.value = false
      break
    case 'end':
      isSettingStart.value = false
      isSettingEnd.value = !isSettingEnd.value
      break
    default:
      isSettingStart.value = false
      isSettingEnd.value = false
      break
  }
}
const setStartOrEnd = (x: number, y: number) => {
  if (isSettingStart.value) {
    start.value = [x, y]
  } else if (isSettingEnd.value) {
    end.value = [x, y]
  }
}
// 修改某个方块的状态
const setDiv = (x: number, y: number) => {
  if (!isMakingWalls.value) {
    setStartOrEnd(x, y)
  } else {
    setWall(x, y)
  }
}

// resetMap when init
resetMap()

// delay to debug
function sleep (t: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, t)
  })
}

// A* find way
const findPath = async (start: Point, end: Point) => {
  const table = DEFAULT_MAP()
  const distance = (point: Point) => {
    return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
  }
  const queue = new Sorted([start], (a, b) => distance(a) - distance(b))
  async function insert (x: number, y: number, pre: Point) {
    // 越界
    if (x < 0 || x >= width.value || y < 0 || y >= height.value || table[y][x] || map.value[y][x]) return
    if (isDebug.value) {
      await sleep(delay.value)
    }
    table[y][x] = pre
    setCurValue(x, y, 1)
    queue.give([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.take()
    // 到终点
    if (x === end[0] && y === end[1]) {
      const path = []
      while (x !== start[0] || y !== start[1]) {
        // [x, y] = table[y][x]
        const [a, b] = table[y][x] as Point
        x = a
        y = b
        path.push(map.value[y][x])
        if (isDebug.value) {
          await sleep(delay.value)
        }
        setCurValue(x, y, 2)
      }
      return path
    }
    const cur: Point = [x, y]
    if (isDebug.value) {
      await insert(x, y - 1, cur)
      await insert(x, y + 1, cur)
      await insert(x - 1, y, cur)
      await insert(x + 1, y, cur)
    } else {
      insert(x, y - 1, cur)
      insert(x, y + 1, cur)
      insert(x - 1, y, cur)
      insert(x + 1, y, cur)
    }
  }
  return null
}
</script>

<style lang='scss' scoped>

</style>
