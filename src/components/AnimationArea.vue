<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 动画控制状态
const isPlaying = ref(true)
const animationSpeed = ref(1)
const animationFrame = ref<number | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

// 河道参数
const riverPath = ref([
  { x: 0.1, y: 0.5 },   // 河道起点
  { x: 0.3, y: 0.4 },
  { x: 0.5, y: 0.5 },
  { x: 0.7, y: 0.6 },
  { x: 0.9, y: 0.5 }    // 河道终点
])

// 污染源参数
const pollutionSource = ref({
  x: 0.1,  // 河道起点位置
  y: 0.5,
  radius: 0.03,
  intensity: 1.0
})

// 动画时间
let animationTime = 0

// 初始化Canvas
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置Canvas尺寸
  const resizeCanvas = () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  return () => {
    window.removeEventListener('resize', resizeCanvas)
  }
}

// 绘制河道形状
const drawRiver = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.beginPath()
  
  // 计算河道宽度（根据位置变化，模拟真实河道）
  const riverWidth = (index: number) => {
    return height * (0.15 + 0.05 * Math.sin(index * 0.5))
  }
  
  // 绘制河道主体
  for (let i = 0; i < riverPath.value.length - 1; i++) {
    const p1 = riverPath.value[i]
    const p2 = riverPath.value[i + 1]
    
    const x1 = p1.x * width
    const y1 = p1.y * height
    const x2 = p2.x * width
    const y2 = p2.y * height
    
    // 计算河道方向向量
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx * dx + dy * dy)
    
    // 计算垂直向量
    const nx = -dy / length
    const ny = dx / length
    
    // 河道宽度
    const w1 = riverWidth(i)
    const w2 = riverWidth(i + 1)
    
    if (i === 0) {
      // 第一个点
      ctx.moveTo(x1 + nx * w1, y1 + ny * w1)
    }
    
    // 绘制河道一侧
    ctx.lineTo(x2 + nx * w2, y2 + ny * w2)
  }
  
  // 绘制河道另一侧
  for (let i = riverPath.value.length - 1; i > 0; i--) {
    const p1 = riverPath.value[i]
    const p2 = riverPath.value[i - 1]
    
    const x1 = p1.x * width
    const y1 = p1.y * height
    const x2 = p2.x * width
    const y2 = p2.y * height
    
    // 计算河道方向向量
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx * dx + dy * dy)
    
    // 计算垂直向量
    const nx = -dy / length
    const ny = dx / length
    
    // 河道宽度
    const w1 = riverWidth(i)
    const w2 = riverWidth(i - 1)
    
    // 绘制河道另一侧
    ctx.lineTo(x2 - nx * w2, y2 - ny * w2)
  }
  
  ctx.closePath()
  
  // 填充河道基础颜色
  ctx.fillStyle = '#001f3f'
  ctx.fill()
}

// 根据污染程度获取颜色（从红到蓝的渐变）
const getPollutionColor = (pollutionLevel: number): [number, number, number] => {
  // 污染程度从0（无污染）到1（重度污染）
  // 颜色从蓝色（0, 0, 255）渐变到红色（255, 0, 0）
  const r = Math.floor(255 * pollutionLevel)
  const g = 0
  const b = Math.floor(255 * (1 - pollutionLevel))
  return [r, g, b]
}

// 计算点到河道的最近距离
const distanceToRiver = (x: number, y: number, width: number, height: number): number => {
  let minDistance = Infinity
  
  for (let i = 0; i < riverPath.value.length - 1; i++) {
    const p1 = riverPath.value[i]
    const p2 = riverPath.value[i + 1]
    
    const x1 = p1.x * width
    const y1 = p1.y * height
    const x2 = p2.x * width
    const y2 = p2.y * height
    
    // 计算点到线段的距离
    const A = x - x1
    const B = y - y1
    const C = x2 - x1
    const D = y2 - y1
    
    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1
    
    if (lenSq !== 0) {
      param = dot / lenSq
    }
    
    let xx, yy
    
    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }
    
    const dx = x - xx
    const dy = y - yy
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    minDistance = Math.min(minDistance, distance)
  }
  
  return minDistance
}

// 绘制污染扩散动画
const drawPollutionAnimation = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // 清除画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制背景
  ctx.fillStyle = '#000814'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制河道
  drawRiver(ctx, width, height)

  // 计算污染扩散范围
  const maxSpreadDistance = Math.max(width, height) * 0.8
  const currentSpreadDistance = (animationTime * 0.03 * animationSpeed.value) % maxSpreadDistance

  // 绘制污染扩散
  const gridSize = 10
  const time = animationTime * 0.01

  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      // 计算点到污染源的距离
      const sourceX = pollutionSource.value.x * width
      const sourceY = pollutionSource.value.y * height
      const distanceToSource = Math.sqrt(Math.pow(x - sourceX, 2) + Math.pow(y - sourceY, 2))
      
      // 计算点到河道的距离
      const distToRiver = distanceToRiver(x, y, width, height)
      
      // 如果点在河道内且在污染扩散范围内
      if (distToRiver < height * 0.15 && distanceToSource < currentSpreadDistance) {
        // 计算污染程度（距离污染源越近，污染越重）
        const pollutionLevel = Math.max(0, 1 - distanceToSource / currentSpreadDistance) * pollutionSource.value.intensity
        
        // 添加波动效果
        const wave = Math.sin(x * 0.05 + time) * Math.cos(y * 0.05 + time) * 0.2 + 0.8
        const adjustedPollutionLevel = pollutionLevel * wave
        
        // 获取污染颜色
        const [r, g, b] = getPollutionColor(adjustedPollutionLevel)
        
        // 设置透明度（污染程度越高，透明度越高）
        const alpha = Math.min(adjustedPollutionLevel * 0.8, 0.8)
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fillRect(x, y, gridSize, gridSize)
      }
    }
  }

  // 绘制污染源
  const sourceX = pollutionSource.value.x * width
  const sourceY = pollutionSource.value.y * height
  const sourceRadius = pollutionSource.value.radius * width
  
  ctx.beginPath()
  ctx.arc(sourceX, sourceY, sourceRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#ff0000'
  ctx.fill()
  
  // 添加污染源发光效果
  const gradient = ctx.createRadialGradient(
    sourceX, sourceY, 0,
    sourceX, sourceY, sourceRadius * 3
  )
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)')
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
  
  ctx.beginPath()
  ctx.arc(sourceX, sourceY, sourceRadius * 3, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // 更新动画时间
  if (isPlaying.value) {
    animationTime += animationSpeed.value
  }

  // 继续动画
  animationFrame.value = requestAnimationFrame(drawPollutionAnimation)
}

// 控制动画播放/暂停
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

// 加速动画
const speedUp = () => {
  animationSpeed.value = Math.min(animationSpeed.value + 0.5, 5)
}

// 减速动画
const slowDown = () => {
  animationSpeed.value = Math.max(animationSpeed.value - 0.5, 0.5)
}

// 重置动画
const resetAnimation = () => {
  animationTime = 0
  animationSpeed.value = 1
  isPlaying.value = true
}

// 组件挂载时初始化
onMounted(() => {
  const cleanup = initCanvas()
  drawPollutionAnimation()
  
  // 组件卸载时清理
  onUnmounted(() => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value)
    }
    if (cleanup) cleanup()
  })
})
</script>

<template>
  <div class="animation-container">
    <div class="animation-controls">
      <button @click="togglePlay" class="control-btn">
        {{ isPlaying ? '暂停' : '播放' }}
      </button>
      <button @click="slowDown" class="control-btn">减速</button>
      <button @click="speedUp" class="control-btn">加速</button>
      <button @click="resetAnimation" class="control-btn">重置</button>
      <div class="speed-indicator">
        速度: {{ animationSpeed.toFixed(1) }}x
      </div>
    </div>
    <div class="canvas-container">
      <canvas ref="canvasRef" class="pollution-canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.animation-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.animation-controls {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px 8px 0 0;
}

.control-btn {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-btn:hover {
  background-color: #40a9ff;
}

.speed-indicator {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: white;
  font-weight: bold;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 8px 8px;
}

.pollution-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>