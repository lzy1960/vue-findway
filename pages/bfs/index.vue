<template>
  <div class="bfs">
    <button @click="findPath(map, start, end)">start</button>
    <div :ref="el => mainEl = el" class="main">
      <div v-for="_, y in HEIGHT" :key="y">
        <div v-for="_, x in WIDTH" :key="`${x}_${y}`" inline-block w-5 h-5 bg-gray-7 bg-op-30 m-2px cursor-pointer
          hover:bg-op-80 :class="divClass(x, y)" @click="setWall(map, x, y)">
          <span>{{ content(x, y) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Point = [number, number]
class Sorted {
  data: any;
  compare: any;
  constructor(data: Point[], compare: (a: Point, b: Point) => number) {
    this.data = data.slice()
    this.compare = compare || ((a: number, b: number) => a - b)
  }
  take() {
    if(!this.data.length) return 
    // 记录最小值
    let min = this.data[0]
    // 记录最小值的索引
    let minIndex = 0
    // 开始比较数组里所有的值，找到更小的值，就记录为min
    // 同时记录最小值和最小值的位置
    for(let i = 1; i < this.data.length; i++) {
      if(this.compare(this.data[i], min) < 0) {
        min = this.data[i]
        minIndex = i
      }
    }
    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()
    return min
  }
  give(value: Point) {
    this.data.push(value)
  }
  get length() {
    return this.data.length
  }
}
const WIDTH = ref(30)
const HEIGHT = ref(20)
// 0 空地
// 1 扫描过的路
// 2 最终的路
// 3 墙壁
const map = ref(Array(HEIGHT.value).fill(0).map(v => Array(WIDTH.value).fill(0)))
const start = [2, 2]
const end = [20, 15]
const content = (x: number, y: number) => {
  if(x === start[0] && y === start[1]) return 'S'
  if(x === end[0] && y === end[1]) return 'E'
  return map[y]?.[x] || ''
}
const divClass = (x: number, y: number) => {
  const cur = map.value[y]?.[x]
  if(cur === 2) return 'bg-skyblue'
  if(cur === 3) return 'bg-red'
  if(cur) return 'bg-purple'
  return ''
}
const setColor = (x: number, y: number, color: string) => {
  mainEl.value.children[y].children[x].style.backgroundColor = color
}
const mainEl = ref()
const setWall = (map: Point[], x: number, y: number) => {
  console.log(x, y)
  console.log(map[y][x])
  map[y][x] = 3
  // setColor(x, y, 'purple')
  console.log(map)
}
function sleep (t: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}
const findPath = async (map: Point[], start: Point, end: Point) => {
  const table = Object.create(map)
  const distance = (point: Point) => {
    return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
  }
  const queue = new Sorted([start], (a, b) => distance(a) - distance(b))
  async function insert (x: number, y: number, pre: Point) {
    // console.log(pre)
    // 越界
    if (x < 0 || x >= WIDTH.value || y < 0 || y >= HEIGHT.value || table[y][x]) return
    await sleep(1)
    table[y][x] = pre
    setColor(x, y, 'orange')
    queue.give([x, y])
  }
  while (queue.length) {
    let [x, y] = queue.take()
    // 到终点
    if (x === end[0] && y === end[1]) {
      let path = []
      while(x !== start[0] || y !== start[1]) {
        // [x, y] = table[y][x]
        let a = table[y][x][0]
        let b = table[y][x][1]
        x = a
        y = b
        path.push(map[y][x])
        await sleep(1)
        // map[y][x] = 2
        setColor(x, y, 'skyblue')
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
