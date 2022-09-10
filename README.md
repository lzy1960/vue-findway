<h2 align="center">
Vue Bfs Visual
</h2>
<p align="center">
寻路算法的可视化展示
</p>
<p align="center">
<a href="https://vue3-findway.netlify.app/bfs">DEMO</a>
</p>
<p align="center">
<img src="https://user-images.githubusercontent.com/40552111/189466594-4ed5a582-501d-4278-aceb-ce8b6496fbbd.png" width="600"/>
</p>

## 技术栈

- vue3
- nuxt3
- unocss

## 功能

- 修改起点和终点
- 绘制墙壁
- 保存地图上墙壁的信息
- debug 模式

## 如何操作？

1. 开启绘制墙壁的状态，按住方块拖动，可绘制墙壁，松开即可停止绘制
2. 如果绘制错误，点击右键可以删除墙壁，或点击 reset map 重置
3. 点击修改起点(终点)，再点击方块，可以修改起点(终点)的位置
4. 点击 start，生成寻路结果

> PS: 开启 debug 模式，可设置延迟时间，便于观察寻路算法的执行过程
