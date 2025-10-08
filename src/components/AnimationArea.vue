<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// 河道配置
const RIVER_CONFIG = {
  // 河道路径点（2D）
  pathPoints: [
    { x: -8, y: 5 },    // 河道起点（左上）
    { x: -7, y: 4.5 },
    { x: -6, y: 4 },
    { x: -5, y: 3.2 },  // 弯曲点
    { x: -4, y: 2.5 },
    { x: -3, y: 2 },
    { x: -2, y: 1.5 },
    { x: -1, y: 1 },
    { x: 0, y: 0.5 },   // 中间点
    { x: 1, y: 0 },
    { x: 2, y: -0.8 },
    { x: 3, y: -1.5 },  // 弯曲点
    { x: 4, y: -2.2 },
    { x: 5, y: -3 },
    { x: 6, y: -3.8 },
    { x: 7, y: -4.5 },
    { x: 8, y: -5 }     // 河道终点（右下）
  ],
  baseWidth: 2.0,        // 基础河道宽度
  widthVariationAmplitude: 0.3,  // 宽度变化幅度
  widthVariationFrequency: 3,    // 宽度变化频率（周期数）
  curveSegments: 100,    // 曲线分段数
  color: 0x87CEEB,       // 河道颜色
  opacity: 0.3           // 河道透明度
}

// 响应式变量
const containerRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(true)
const animationSpeed = ref(1)
const animationRef = ref<number | null>(null)
const pollutionSource = ref({ x: RIVER_CONFIG.pathPoints[0].x, y: RIVER_CONFIG.pathPoints[0].y })  // 污染源位置（河道起点）

// Three.js 相关变量
let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let riverMesh: THREE.Mesh
let pollutionParticles: THREE.Points
let pollutionMaterial: THREE.PointsMaterial
let clock: THREE.Clock

// 渲染器配置
const RENDERER_CONFIG = {
  antialias: true
}

// 粒子系统配置
const PARTICLE_CONFIG = {
  count: 3000,           // 粒子数量
  size: 0.1,             // 粒子大小
  sizeRange: [0.05, 0.2], // 粒子大小范围
  opacity: 0.8,          // 粒子透明度
  randomFactor: 0.1,     // 随机流动因子
  lateralFactor: 0.2,    // 横向流动因子
  maxPollutionDistance: 16,  // 最大污染距离
  riverMoveSpeedFactor: 2,   // 粒子向河道移动的速度因子
  boundary: {           // 边界范围
    x: { min: -9, max: 9 },
    y: { min: -6, max: 6 }
  }
}

// 相机配置
const CAMERA_CONFIG = {
  position: { x: 0, y: 0, z: 10 },
  frustumSize: 15,
  near: 0.1,
  far: 1000
}

// 场景配置
const SCENE_CONFIG = {
  background: 0x000814,
  ambientLight: {
    color: 0x404040,
    intensity: 1.5
  },
  directionalLight: {
    color: 0xffffff,
    intensity: 1,
    position: { x: 0, y: 0, z: 10 }
  }
}

// 初始化 Three.js 场景
const initThreeJS = () => {
  const container = containerRef.value
  if (!container) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(SCENE_CONFIG.background)

  // 创建相机
  createCamera(container)

  // 创建渲染器
  createRenderer(container)

  // 添加光源
  addLights()

  // 创建河道
  createRiver()

  // 创建污染粒子系统
  createPollutionParticles()

  // 创建时钟
  clock = new THREE.Clock()

  // 处理窗口大小变化
  const handleResize = () => {
    if (!container) return
    updateCameraSize(container)
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
    container.removeChild(renderer.domElement)
  }
}

// 创建相机
const createCamera = (container: HTMLDivElement) => {
  const { frustumSize, near, far, position } = CAMERA_CONFIG
  const aspect = container.clientWidth / container.clientHeight
  
  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    near,
    far
  )
  
  camera.position.set(position.x, position.y, position.z)
}

// 创建渲染器
const createRenderer = (container: HTMLDivElement) => {
  renderer = new THREE.WebGLRenderer({ antialias: RENDERER_CONFIG.antialias })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)
}

// 添加光源
const addLights = () => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(
    SCENE_CONFIG.ambientLight.color,
    SCENE_CONFIG.ambientLight.intensity
  )
  scene.add(ambientLight)

  // 方向光
  const directionalLight = new THREE.DirectionalLight(
    SCENE_CONFIG.directionalLight.color,
    SCENE_CONFIG.directionalLight.intensity
  )
  directionalLight.position.set(
    SCENE_CONFIG.directionalLight.position.x,
    SCENE_CONFIG.directionalLight.position.y,
    SCENE_CONFIG.directionalLight.position.z
  )
  scene.add(directionalLight)
}

// 更新相机尺寸
const updateCameraSize = (container: HTMLDivElement) => {
  const { frustumSize } = CAMERA_CONFIG
  const aspect = container.clientWidth / container.clientHeight
  
  const orthoCamera = camera as THREE.OrthographicCamera
  orthoCamera.left = frustumSize * aspect / -2
  orthoCamera.right = frustumSize * aspect / 2
  orthoCamera.top = frustumSize / 2
  orthoCamera.bottom = frustumSize / -2
  orthoCamera.updateProjectionMatrix()
}

// 创建河道曲线
const createRiverCurve = () => {
  const points = RIVER_CONFIG.pathPoints.map(p => new THREE.Vector2(p.x, p.y))
  return new THREE.SplineCurve(points)
}

// 计算河道宽度变化
const calculateRiverWidth = (t: number) => {
  const { baseWidth, widthVariationAmplitude, widthVariationFrequency } = RIVER_CONFIG
  const widthVariation = Math.sin(t * Math.PI * widthVariationFrequency) * widthVariationAmplitude + 1
  return baseWidth * widthVariation
}

// 创建河道几何体
const createRiver = () => {
  // 创建河道曲线
  const riverCurve = createRiverCurve()
  
  // 创建河道形状
  const riverShape = createRiverShape(riverCurve)
  
  // 创建河道几何体
  const geometry = new THREE.ShapeGeometry(riverShape)
  
  // 创建材质
  const material = new THREE.MeshBasicMaterial({
    color: RIVER_CONFIG.color,  // 使用配置中的河道颜色
    transparent: true,
    opacity: RIVER_CONFIG.opacity,
    side: THREE.DoubleSide
  })
  
  // 创建河道网格
  riverMesh = new THREE.Mesh(geometry, material)
  scene.add(riverMesh)
}

// 创建河道形状
const createRiverShape = (riverCurve: THREE.SplineCurve) => {
  const riverShape = new THREE.Shape()
  const curvePoints = riverCurve.getPoints(RIVER_CONFIG.curveSegments)  // 使用配置中的曲线分段数
  
  // 计算河道两侧的点 - 实现有粗有细的效果
  const baseRiverWidth = RIVER_CONFIG.baseWidth  // 使用配置中的基础河道宽度
  const leftPoints: THREE.Vector2[] = []
  const rightPoints: THREE.Vector2[] = []
  
  for (let i = 0; i < curvePoints.length; i++) {
    const point = curvePoints[i]
    
    // 计算切线方向
    let tangent = new THREE.Vector2()
    if (i < curvePoints.length - 1) {
      tangent = curvePoints[i + 1].clone().sub(point).normalize()
    } else {
      tangent = point.clone().sub(curvePoints[i - 1]).normalize()
    }
    
    // 计算法线方向（垂直于切线）
    const normal = new THREE.Vector2(-tangent.y, tangent.x)
    
    // 根据位置计算河道宽度变化 - 实现有粗有细的效果
    // 使用正弦函数创建周期性的宽度变化，但减小变化幅度
    const widthVariation = Math.sin(i / curvePoints.length * Math.PI * RIVER_CONFIG.widthVariationFrequency) * RIVER_CONFIG.widthVariationAmplitude + 1
    const riverWidth = baseRiverWidth * widthVariation
    
    // 计算河道两侧的点
    const leftPoint = new THREE.Vector2(
      point.x + normal.x * riverWidth,
      point.y + normal.y * riverWidth
    )
    const rightPoint = new THREE.Vector2(
      point.x - normal.x * riverWidth,
      point.y - normal.y * riverWidth
    )
    
    leftPoints.push(leftPoint)
    rightPoints.push(rightPoint)
  }
  
  // 创建河道形状
  riverShape.moveTo(leftPoints[0].x, leftPoints[0].y)
  for (let i = 1; i < leftPoints.length; i++) {
    riverShape.lineTo(leftPoints[i].x, leftPoints[i].y)
  }
  for (let i = rightPoints.length - 1; i >= 0; i--) {
    riverShape.lineTo(rightPoints[i].x, rightPoints[i].y)
  }
  riverShape.closePath()
  
  return riverShape
}

// 创建污染粒子系统
const createPollutionParticles = () => {
  // 创建粒子几何体
  const particleGeometry = new THREE.BufferGeometry()
  
  // 初始化粒子属性
  const particleCount = PARTICLE_CONFIG.count
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)
  
  // 创建河道曲线
  const riverCurve = createRiverCurve()
  
  // 初始化粒子位置、颜色和大小
  initializeParticles(positions, colors, sizes, riverCurve)
  
  // 设置几何体属性
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  
  // 创建粒子材质
  pollutionMaterial = new THREE.PointsMaterial({
    size: PARTICLE_CONFIG.size,
    vertexColors: true,
    transparent: true,
    opacity: PARTICLE_CONFIG.opacity,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })
  
  // 创建粒子系统
  pollutionParticles = new THREE.Points(particleGeometry, pollutionMaterial)
  scene.add(pollutionParticles)
}

// 初始化粒子属性
const initializeParticles = (
  positions: Float32Array,
  colors: Float32Array,
  sizes: Float32Array,
  riverCurve: THREE.SplineCurve
) => {
  const { count, sizeRange } = PARTICLE_CONFIG
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    
    // 在河道内随机分布粒子
    const t = Math.random()  // 沿着河道的随机位置
    const point = riverCurve.getPoint(t)
    const tangent = riverCurve.getTangent(t)
    const normal = new THREE.Vector2(-tangent.y, tangent.x)
    
    // 计算该位置的河道宽度
    const riverWidth = calculateRiverWidth(t)
    
    // 在河道宽度内随机偏移
    const lateralOffset = (Math.random() - 0.5) * riverWidth * 0.8
    
    // 初始位置在河道内随机分布
    positions[i3] = point.x + normal.x * lateralOffset
    positions[i3 + 1] = point.y + normal.y * lateralOffset
    positions[i3 + 2] = 0  // Z轴设为0
    
    // 初始颜色为红色（重度污染）
    colors[i3] = 1.0     // R
    colors[i3 + 1] = 0.0 // G
    colors[i3 + 2] = 0.0 // B
    
    // 粒子大小
    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
  }
}

// 更新污染粒子
const updatePollutionParticles = (deltaTime: number) => {
  if (!pollutionParticles) return
  
  const positions = pollutionParticles.geometry.attributes.position.array as Float32Array
  const colors = pollutionParticles.geometry.attributes.color.array as Float32Array
  const particleCount = positions.length / 3
  
  // 创建河道曲线（2D）- 使用配置中的路径点
  const riverPoints = RIVER_CONFIG.pathPoints.map(p => new THREE.Vector2(p.x, p.y))
  
  const curve = new THREE.SplineCurve(riverPoints)
  const baseRiverWidth = RIVER_CONFIG.baseWidth  // 使用配置中的基础河道宽度
  
  // 更新每个粒子
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // 获取当前位置
    const x = positions[i3]
    const y = positions[i3 + 1]
    
    // 计算到污染源的距离
    const distanceToSource = Math.sqrt(
      Math.pow(x - pollutionSource.value.x, 2) +
      Math.pow(y - pollutionSource.value.y, 2)
    )
    
    // 计算到河道的最近点
    const closestInfo = findClosestPointOnRiver(x, y, curve)
    
    // 计算该位置的河道宽度
    const riverWidth = calculateRiverWidth(closestInfo.t)
    
    // 如果粒子在河道内，则沿着河道流动
    if (closestInfo.distance < riverWidth) {  // 河道宽度
      updateParticleInRiver(i, positions, colors, curve, closestInfo, riverWidth, distanceToSource, deltaTime)
    } else {
      // 如果粒子不在河道内，则向河道移动
      updateParticleOutsideRiver(i, positions, closestInfo.point, deltaTime)
    }
    
    // 检查粒子边界并重置如果需要
    checkParticleBoundaries(i, positions, colors, baseRiverWidth)
  }
  
  // 更新几何体
  pollutionParticles.geometry.attributes.position.needsUpdate = true
  pollutionParticles.geometry.attributes.color.needsUpdate = true
}

// 找到河道上距离粒子最近的点
const findClosestPointOnRiver = (x: number, y: number, curve: THREE.SplineCurve) => {
  let closestPoint = new THREE.Vector2()
  let minDistance = Infinity
  let closestT = 0
  
  // 通过采样曲线上的点来找到最近点
  for (let u = 0; u <= 1; u += 0.01) {
    const point = curve.getPoint(u)
    const distance = Math.sqrt(
      Math.pow(x - point.x, 2) +
      Math.pow(y - point.y, 2)
    )
    
    if (distance < minDistance) {
      minDistance = distance
      closestPoint = point.clone()
      closestT = u
    }
  }
  
  return {
    point: closestPoint,
    t: closestT,
    distance: minDistance
  }
}

// 更新河道内粒子的位置
const updateParticleInRiver = (
  index: number,
  positions: Float32Array,
  colors: Float32Array,
  curve: THREE.SplineCurve,
  closestInfo: { point: THREE.Vector2, t: number, distance: number },
  riverWidth: number,
  distanceToSource: number,
  deltaTime: number
) => {
  const i3 = index * 3
  
  // 计算流动方向（沿着河道）
  const t = Math.min(0.99, Math.max(0.01, closestInfo.t))
  const tangent = curve.getTangent(t)
  
  // 计算法线方向（垂直于切线）
  const normal = new THREE.Vector2(-tangent.y, tangent.x)
  
  // 添加一些随机性，使粒子在河道内随机分布
  const randomFactor = PARTICLE_CONFIG.randomFactor
  const flowX = tangent.x + (Math.random() - 0.5) * randomFactor
  const flowY = tangent.y + (Math.random() - 0.5) * randomFactor
  
  // 添加横向随机移动，使粒子填充整个河道宽度
  const lateralFactor = PARTICLE_CONFIG.lateralFactor
  const lateralX = normal.x * (Math.random() - 0.5) * lateralFactor * riverWidth
  const lateralY = normal.y * (Math.random() - 0.5) * lateralFactor * riverWidth
  
  // 更新位置
  positions[i3] += (flowX + lateralX) * deltaTime * animationSpeed.value
  positions[i3 + 1] += (flowY + lateralY) * deltaTime * animationSpeed.value
  
  // 计算污染程度（距离污染源越远，污染越轻）
  const pollutionLevel = Math.max(0, 1 - distanceToSource / PARTICLE_CONFIG.maxPollutionDistance)
  
  // 更新颜色（从红色到蓝色的渐变）
  colors[i3] = pollutionLevel     // R
  colors[i3 + 1] = 0              // G
  colors[i3 + 2] = 1 - pollutionLevel // B
}

// 更新河道外粒子的位置
const updateParticleOutsideRiver = (
  index: number,
  positions: Float32Array,
  closestPoint: THREE.Vector2,
  deltaTime: number
) => {
  const i3 = index * 3
  const x = positions[i3]
  const y = positions[i3 + 1]
  
  // 如果粒子不在河道内，则向河道移动
  const directionToRiver = new THREE.Vector2(
    closestPoint.x - x,
    closestPoint.y - y
  ).normalize()
  
  positions[i3] += directionToRiver.x * deltaTime * animationSpeed.value * PARTICLE_CONFIG.riverMoveSpeedFactor
  positions[i3 + 1] += directionToRiver.y * deltaTime * animationSpeed.value * PARTICLE_CONFIG.riverMoveSpeedFactor
}

// 检查粒子边界并重置如果需要
const checkParticleBoundaries = (
  index: number,
  positions: Float32Array,
  colors: Float32Array,
  baseRiverWidth: number
) => {
  const i3 = index * 3
  const x = positions[i3]
  const y = positions[i3 + 1]
  
  // 如果粒子流出了河道范围，则重置到污染源
  if (x > PARTICLE_CONFIG.boundary.x.max || x < PARTICLE_CONFIG.boundary.x.min || y > PARTICLE_CONFIG.boundary.y.max || y < PARTICLE_CONFIG.boundary.y.min) {
    // 重置位置到污染源附近，但在整个河道宽度内随机分布
    const randomAngle = Math.random() * Math.PI * 2
    const randomRadius = Math.random() * baseRiverWidth * 0.8
    
    positions[i3] = pollutionSource.value.x + Math.cos(randomAngle) * randomRadius
    positions[i3 + 1] = pollutionSource.value.y + Math.sin(randomAngle) * randomRadius
    
    // 重置颜色为红色
    colors[i3] = 1.0     // R
    colors[i3 + 1] = 0.0 // G
    colors[i3 + 2] = 0.0 // B
  }
}

// 动画循环
const animate = () => {
  animationRef.value = requestAnimationFrame(animate)
  
  if (isPlaying.value) {
    const deltaTime = clock.getDelta()
    updatePollutionParticles(deltaTime * animationSpeed.value)
  }
  
  renderer.render(scene, camera)
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

// 重置单个粒子
const resetParticle = (positions: Float32Array, colors: Float32Array, index: number, curve: THREE.SplineCurve) => {
  const i3 = index * 3
  
  // 在河道内随机分布粒子
  const t = Math.random()  // 沿着河道的随机位置
  const point = curve.getPoint(t)
  const tangent = curve.getTangent(t)
  const normal = new THREE.Vector2(-tangent.y, tangent.x)
  
  // 计算该位置的河道宽度
  const riverWidth = calculateRiverWidth(t)
  
  // 在河道宽度内随机偏移
  const lateralOffset = (Math.random() - 0.5) * riverWidth * 0.8
  
  // 重置位置在河道内随机分布
  positions[i3] = point.x + normal.x * lateralOffset
  positions[i3 + 1] = point.y + normal.y * lateralOffset
  positions[i3 + 2] = 0  // Z轴设为0
  
  // 重置颜色为红色
  colors[i3] = 1.0     // R
  colors[i3 + 1] = 0.0 // G
  colors[i3 + 2] = 0.0 // B
}

// 重置动画
const resetAnimation = () => {
  animationSpeed.value = 1
  isPlaying.value = true
  
  // 重置粒子位置和颜色
  if (pollutionParticles) {
    const positions = pollutionParticles.geometry.attributes.position.array as Float32Array
    const colors = pollutionParticles.geometry.attributes.color.array as Float32Array
    const particleCount = positions.length / 3
    
    // 创建河道曲线
    const curve = createRiverCurve()
    
    // 重置所有粒子
    for (let i = 0; i < particleCount; i++) {
      resetParticle(positions, colors, i, curve)
    }
    
    pollutionParticles.geometry.attributes.position.needsUpdate = true
    pollutionParticles.geometry.attributes.color.needsUpdate = true
  }
}

// 组件挂载时初始化
onMounted(() => {
  const cleanup = initThreeJS()
  animate()
  
  // 组件卸载时清理
  onUnmounted(() => {
    if (animationRef.value) {
      cancelAnimationFrame(animationRef.value)
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
    <div ref="containerRef" class="canvas-container"></div>
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
  z-index: 10;
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
</style>