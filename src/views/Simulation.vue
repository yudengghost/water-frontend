<template>
  <div class="text-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 glass-effect">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="index.html" class="flex items-center transition-transform hover:scale-105">
              <div class="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </div>
              <router-link to="/" class="text-xl font-bold gradient-text">
                返回主页
              </router-link>
            </a>
          </div>
          <div class="hidden md:block">
            <h1 class="text-2xl font-bold text-cyan-400">水污染扩散模拟系统</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-300">实时监测中</span>
            <div class="w-3 h-3 bg-green-500 rounded-full pulse-animation"></div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="bento-layout">
      <!-- Control Panel -->
      <div class="control-area">
        <div class="control-panel h-full">
          <h2 class="text-xl font-bold gradient-text mb-4">模拟控制面板</h2>
          
          <!-- Playback Controls (仅在正演模式下显示) -->
          <div class="mb-6" v-if="simulation.calculationType === 'forward'">
            <h3 class="text-lg font-semibold mb-3 text-cyan-400">播放控制</h3>
            <div class="flex flex-wrap gap-2">
              <button @click="startSimulation" class="control-button" v-if="!simulation.isRunning">
                <span class="flex items-center">
                  播放
                </span>
              </button>
              <button @click="pauseSimulation" class="control-button" v-else>
                <span class="flex items-center">
                  暂停
                </span>
              </button>
              <button @click="resetSimulation" class="control-button">
                <span class="flex items-center">
                  重置
                </span>
              </button>
            </div>
            <div class="mt-3">
              <label class="block text-sm text-gray-300 mb-2">播放速度</label>
              <select v-model="simulation.speed" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
              </select>
            </div>
          </div>
          
          <!-- Scientific Mode Settings -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 text-cyan-400">计算模式</h3>
            
            <div class="mb-3">
              <label class="block text-sm text-gray-300 mb-2">计算类型</label>
              <select v-model="simulation.calculationType" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                <option value="forward">正演（预测浓度）</option>
                <option value="inverse">反演（定位污染源）</option>
              </select>
            </div>
            
            <div class="mb-3" v-if="simulation.calculationType === 'forward'">
              <label class="block text-sm text-gray-300 mb-2">污染源类型</label>
              <select v-model="simulation.sourceType" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                <option value="instant">瞬时源</option>
                <option value="finite">初始有限源</option>
              </select>
          </div>
          
            <div class="mb-3" v-if="simulation.calculationType === 'forward'">
              <label class="block text-sm text-gray-300 mb-2">维度</label>
              <select v-model="simulation.dimension" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                <option value="1D">一维</option>
                <option value="2D">二维</option>
                <option value="3D">三维</option>
              </select>
            </div>

            <!-- 正演参数输入 -->
            <div class="space-y-3 mt-4" v-if="simulation.calculationType === 'forward'">
              <div v-if="simulation.sourceType === 'instant'">
                <label class="block text-sm text-gray-300 mb-2">投放质量 M (kg)</label>
                <input type="number" v-model.number="simulation.params.M" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="0" step="0.1">
              </div>
              
              <div v-if="simulation.sourceType === 'finite'">
                <label class="block text-sm text-gray-300 mb-2">初始浓度 C₀ (mg/L)</label>
                <input type="number" v-model.number="simulation.params.C0" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="0" step="0.1">
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">扩散系数 D (m²/s)</label>
                <input type="number" v-model.number="simulation.params.D" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="0.01" step="0.01">
              </div>

              <div v-if="simulation.sourceType === 'finite'">
                <label class="block text-sm text-gray-300 mb-2">污染源半长 (m)</label>
                <input type="number" v-model.number="simulation.params.h" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="1" step="1">
              </div>

              <div v-if="simulation.dimension !== '1D' && simulation.sourceType === 'finite'">
                <label class="block text-sm text-gray-300 mb-2">污染源半宽 (m)</label>
                <input type="number" v-model.number="simulation.params.b" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="1" step="1">
              </div>

              <div v-if="simulation.dimension === '3D' && simulation.sourceType === 'finite'">
                <label class="block text-sm text-gray-300 mb-2">污染源半高 (m)</label>
                <input type="number" v-model.number="simulation.params.c" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="1" step="1">
              </div>
            </div>

            <!-- 反演参数输入 -->
            <div class="space-y-3 mt-4" v-if="simulation.calculationType === 'inverse'">
              <div class="bg-cyan-900 bg-opacity-30 border border-cyan-600 rounded-lg p-3 mb-3">
                <p class="text-xs text-cyan-300">反演计算说明：输入观测到的浓度和相关参数，系统将计算污染源距离。目前仅支持一维瞬时源反演。</p>
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">观测浓度 C (mg/L)</label>
                <input type="number" v-model.number="simulation.inverseParams.C" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="0.001" step="0.001">
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">观测时间 t (秒)</label>
                <input type="number" v-model.number="simulation.inverseParams.t" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="1" step="1">
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">投放质量 M (kg)</label>
                <input type="number" v-model.number="simulation.inverseParams.M" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="0.1" step="0.1">
              </div>

              <div>
                <label class="block text-sm text-gray-300 mb-2">扩散系数 D (m²/s)</label>
                <input type="number" v-model.number="simulation.inverseParams.D" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" min="0.01" step="0.01">
              </div>

              <button @click="calculateInverse" class="control-button w-full mt-3">
                <span class="flex items-center justify-center">
                  计算污染源位置
                </span>
              </button>

              <!-- 反演结果显示 -->
              <div v-if="simulation.inverseResult !== null" class="mt-4 p-4 bg-gradient-to-r from-cyan-900 to-blue-900 bg-opacity-50 border border-cyan-500 rounded-lg">
                <div class="text-sm text-gray-300 mb-2">污染源距离</div>
                <div class="text-3xl font-bold text-cyan-400 text-center">
                  {{ simulation.inverseResult.toFixed(2) }}
                </div>
                <div class="text-center text-sm text-gray-300 mt-1">米 (m)</div>
              </div>
            </div>

            <!-- 观测点设置（仅在正演模式下显示） -->
            <div class="mt-4 pt-4 border-t border-slate-600" v-if="simulation.calculationType === 'forward'">
              <h4 class="text-md font-semibold mb-3 text-cyan-400">观测点位置</h4>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-400 mt-1">污染源在(0,0)，正值为下游</p>
                  <label class="block text-sm text-gray-300 mb-2">X 坐标 (m)</label>
                  <input type="number" v-model.number="simulation.observationPoint.x" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" step="1">
                </div>
                <div v-if="simulation.dimension !== '1D'">
                  <label class="block text-sm text-gray-300 mb-2">Y 坐标 (m)</label>
                  <input type="number" v-model.number="simulation.observationPoint.y" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" step="1">
                </div>
                <div v-if="simulation.dimension === '3D'">
                  <label class="block text-sm text-gray-300 mb-2">Z 坐标 (m)</label>
                  <input type="number" v-model.number="simulation.observationPoint.z" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white" step="1">
                  <p class="text-xs text-gray-400 mt-1">水深方向，0为水面</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulation Area -->
      <div class="simulation-area">
        <div class="simulation-canvas h-full relative">
          <canvas ref="simulationCanvas" class="w-full h-full rounded-lg"></canvas>
          <div class="absolute top-4 left-4 glass-effect rounded-lg p-3 transition-all hover:shadow-lg">
            <div class="text-sm text-gray-300">模拟时间</div>
            <div class="text-lg font-bold text-cyan-400">{{ formattedTime }}</div>
          </div>
          <div class="absolute bottom-4 left-4 glass-effect rounded-lg p-3 transition-all hover:shadow-lg">
            <div class="text-sm text-gray-300">污染物浓度</div>
            <div class="text-lg font-bold text-cyan-400">{{ avgConcentration.toFixed(2) }} mg/L</div>
          </div>
          <div class="absolute bottom-4 right-4 glass-effect rounded-lg p-3 transition-all hover:shadow-lg">
            <div class="text-sm text-gray-300">河道长度</div>
            <div class="text-lg font-bold text-cyan-400">1000 m</div>
          </div>
          <div class="absolute top-1/2 left-4 transform -translate-y-1/2 glass-effect rounded-lg p-2 transition-all hover:shadow-lg">
            <div class="text-xs text-gray-300">污染源头</div>
          </div>
          <div class="absolute top-1/2 right-4 transform -translate-y-1/2 glass-effect rounded-lg p-2 transition-all hover:shadow-lg">
            <div class="text-xs text-gray-300">下游监测点</div>
          </div>
        </div>
      </div>

      <!-- Data Panel -->
      <div class="data-area">
        <div class="space-y-4">
           <!-- Real-time Data (仅在正演模式下显示) -->
           <div class="data-card" v-if="simulation.calculationType === 'forward'">
             <h3 class="text-lg font-semibold mb-3 text-cyan-400">观测点数据</h3>
             <div class="text-sm text-gray-300 mb-1">观测点浓度</div>
             <div class="concentration-display">{{ observationConcentration.toFixed(3) }}</div>
             <div class="text-center text-sm text-gray-300 mb-3">mg/L</div>
             <div class="space-y-2">
               <div class="flex justify-between">
                 <span class="text-gray-300">观测点位置</span>
                 <span class="text-cyan-400">
                   <span v-if="simulation.dimension === '1D'">X={{ simulation.observationPoint.x }}m</span>
                   <span v-else-if="simulation.dimension === '2D'">({{ simulation.observationPoint.x }}, {{ simulation.observationPoint.y }})m</span>
                   <span v-else>({{ simulation.observationPoint.x }}, {{ simulation.observationPoint.y }}, {{ simulation.observationPoint.z }})m</span>
                 </span>
               </div>
               <div class="flex justify-between">
                 <span class="text-gray-300">计算模式</span>
                 <span class="text-white">{{ simulation.dimension }} {{ simulation.sourceType === 'instant' ? '瞬时源' : '有限源' }}</span>
               </div>
             </div>
           </div>
           
           <!-- Inverse Result (仅在反演模式下显示) -->
           <div class="data-card" v-if="simulation.calculationType === 'inverse'">
             <h3 class="text-lg font-semibold mb-3 text-cyan-400">反演计算结果</h3>
             <div v-if="simulation.inverseResult !== null">
               <div class="text-sm text-gray-300 mb-1">污染源距离</div>
               <div class="concentration-display">{{ simulation.inverseResult.toFixed(2) }}</div>
               <div class="text-center text-sm text-gray-300 mb-3">米 (m)</div>
               <div class="space-y-2">
                 <div class="flex justify-between">
                   <span class="text-gray-300">计算类型</span>
                   <span class="text-white">一维瞬时源反演</span>
                 </div>
                 <div class="flex justify-between">
                   <span class="text-gray-300">观测浓度</span>
                   <span class="text-cyan-400">{{ simulation.inverseParams.C }} mg/L</span>
                 </div>
                 <div class="flex justify-between">
                   <span class="text-gray-300">观测时间</span>
                   <span class="text-cyan-400">{{ simulation.inverseParams.t }} 秒</span>
                 </div>
               </div>
             </div>
             <div v-else class="text-center text-gray-400 py-8">
               请在左侧输入参数并点击"计算污染源位置"按钮
             </div>
           </div>

          <!-- Warning System (仅在正演模式下显示) -->
          <div class="data-card" v-if="simulation.calculationType === 'forward'">
            <h3 class="text-lg font-semibold mb-3 text-cyan-400">预警系统</h3>
            <div class="space-y-2" v-html="warningMessages"></div>
          </div>

          <!-- Chart (仅在正演模式下显示) -->
          <div class="data-card" v-if="simulation.calculationType === 'forward'">
            <h3 class="text-lg font-semibold mb-3 text-cyan-400">观测点浓度趋势</h3>
            <div ref="concentrationChart" style="height: 200px;"></div>
          </div>

          <!-- Statistics -->
          <div class="data-card">
            <h3 class="text-lg font-semibold mb-3 text-cyan-400">统计信息</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">计算类型</span>
                <span class="text-white">{{ simulation.calculationType === 'forward' ? '正演' : '反演' }}</span>
              </div>
              <div class="flex justify-between" v-if="simulation.calculationType === 'forward'">
                <span class="text-gray-300">模拟时长</span>
                <span class="text-white">{{ simulationDuration }}秒</span>
              </div>
              <div class="flex justify-between" v-if="simulation.calculationType === 'forward'">
                <span class="text-gray-300">计算公式</span>
                <span class="text-white">{{ simulation.sourceType === 'instant' ? '瞬时源' : '有限源' }}</span>
              </div>
              <div class="flex justify-between" v-if="simulation.calculationType === 'forward'">
                <span class="text-gray-300">维度</span>
                <span class="text-white">{{ simulation.dimension }}</span>
              </div>
              <div class="flex justify-between" v-if="simulation.calculationType === 'inverse'">
                <span class="text-gray-300">反演模式</span>
                <span class="text-white">一维瞬时源</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">计算精度</span>
                <span class="text-white">±0.001 {{ simulation.calculationType === 'forward' ? 'mg/L' : 'm' }}</span>
              </div>
              <div class="flex justify-between" v-if="simulation.calculationType === 'forward'">
                <span class="text-gray-300">更新频率</span>
                <span class="text-white">实时</span>
              </div>
            </div>
          </div>

          <!-- Scientific Parameters -->
          <div class="data-card">
            <h3 class="text-lg font-semibold mb-3 text-cyan-400">计算参数</h3>
            
            <!-- 正演模式参数 -->
            <div class="space-y-2 text-sm" v-if="simulation.calculationType === 'forward'">
              <div class="flex justify-between">
                <span class="text-gray-300">扩散系数 D</span>
                <span class="text-white">{{ simulation.params.D }} m²/s</span>
              </div>
              <div v-if="simulation.sourceType === 'instant'" class="flex justify-between">
                <span class="text-gray-300">投放质量 M</span>
                <span class="text-white">{{ simulation.params.M }} kg</span>
              </div>
              <div v-if="simulation.sourceType === 'finite'" class="flex justify-between">
                <span class="text-gray-300">初始浓度 C₀</span>
                <span class="text-white">{{ simulation.params.C0 }} mg/L</span>
              </div>
              <div v-if="simulation.sourceType === 'finite'" class="flex justify-between">
                <span class="text-gray-300">污染源尺寸</span>
                <span class="text-white">
                  <span v-if="simulation.dimension === '1D'">h={{ simulation.params.h }}m</span>
                  <span v-else-if="simulation.dimension === '2D'">{{ simulation.params.h }}×{{ simulation.params.b }}m</span>
                  <span v-else>{{ simulation.params.h }}×{{ simulation.params.b }}×{{ simulation.params.c }}m</span>
                </span>
              </div>
            </div>
            
            <!-- 反演模式参数 -->
            <div class="space-y-2 text-sm" v-if="simulation.calculationType === 'inverse'">
              <div class="flex justify-between">
                <span class="text-gray-300">观测浓度 C</span>
                <span class="text-white">{{ simulation.inverseParams.C }} mg/L</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">观测时间 t</span>
                <span class="text-white">{{ simulation.inverseParams.t }} 秒</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">投放质量 M</span>
                <span class="text-white">{{ simulation.inverseParams.M }} kg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">扩散系数 D</span>
                <span class="text-white">{{ simulation.inverseParams.D }} m²/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';
import * as echarts from 'echarts';
import * as calculator from '@/utils/pollutionCalculator';
import { inverseCalculate1D } from '@/utils/pollutionCalculator';

/* ==================== 常量定义 ==================== */
const CONSTANTS = {
  RIVER_WIDTH: 200,
  MAX_PARTICLES: 200,
  INITIAL_PARTICLES: 30,
  PARTICLE_SIZE: 50, // 固定粒子大小
  CHART_UPDATE_INTERVAL: 2000, // 2秒
  CHART_MAX_POINTS: 20,
  RIVER_PATH_STEP: 10,
  CONCENTRATION_THRESHOLD: 0.3,
  DECAY_RATE: 0.997,
  BOUNDARY_LIMIT: 0.85 // 河道边界限制比例
};

/* ==================== 响应式状态 ==================== */
const simulation = reactive({
  // 运行状态
  isRunning: false,
  speed: 1,
  startTime: null,
  currentTime: 0,
  lastFrameTime: 0,
  
  // 计算类型
  calculationType: 'forward', // 'forward' (正演) 或 'inverse' (反演)
  
  // 模拟模式（固定为科学模式）
  mode: 'scientific',
  sourceType: 'instant', // 'instant' 或 'finite'
  dimension: '2D', // '1D', '2D', '3D'
  
  // 科学模式参数
  params: {
    M: 1000, // 投放质量 (kg) - 增大以便观察
    C0: 100, // 初始浓度 (mg/L)
    D: 1.0, // 扩散系数 (m²/s)
    h: 5, // 污染源半长 (m)
    b: 5, // 污染源半宽 (m)
    c: 5  // 污染源半高 (m)
  },
  
  // 反演参数
  inverseParams: {
    C: 10, // 观测浓度 (mg/L)
    t: 100, // 观测时间 (秒)
    M: 1000, // 投放质量 (kg)
    D: 1.0 // 扩散系数 (m²/s)
  },
  
  // 反演结果
  inverseResult: null,
  
  // 河道数据
  riverWidth: CONSTANTS.RIVER_WIDTH,
  riverPath: [],
  pollutionSegments: [],
  maxSegments: CONSTANTS.MAX_PARTICLES,
  
  // 图表数据
  chartData: [],
  chartCategories: [],
  
  // 科学模式计算结果
  scientificData: [],
  
  // 观测点
  observationPoint: {
    x: 10, // 下游10米（更近，更容易观察）
    y: 0,  // 河道中心
    z: 0   // 水面
  }
});

/* ==================== DOM 引用 ==================== */
const simulationCanvas = ref(null);
const concentrationChart = ref(null);

/* ==================== 全局变量 ==================== */
let chartInstance = null;
let animationId = null;
let ctx = null;
let lastChartUpdate = 0;

/* ==================== 计算属性 ==================== */

// 格式化模拟时间
const formattedTime = computed(() => {
  const elapsed = Math.floor(simulation.currentTime / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// 平均污染浓度（保留用于预警系统）
const avgConcentration = computed(() => {
  return observationConcentration.value;
});

// 最大污染浓度（保留用于预警系统）
const maxConcentration = computed(() => {
  return observationConcentration.value;
});

// 污染扩散范围
const diffusionRange = computed(() => {
  if (simulation.pollutionSegments.length === 0) return 0;
  const maxX = Math.max(...simulation.pollutionSegments.map(s => s.x + CONSTANTS.PARTICLE_SIZE));
  return Math.floor(maxX / 2); // 转换为米数
});

// 模拟时长（秒）
const simulationDuration = computed(() => {
  return Math.floor(simulation.currentTime / 1000);
});

// 观测点浓度
const observationConcentration = computed(() => {
  const t = simulation.currentTime / 1000; // 时间（秒）
  
  // 给一个最小时间值，避免除以0
  const timeForCalculation = Math.max(t, 0.1);
  
  const x = simulation.observationPoint.x;
  const y = simulation.observationPoint.y;
  const z = simulation.observationPoint.z;
  
  let concentration = 0;
  
  try {
    if (simulation.dimension === '1D') {
      if (simulation.sourceType === 'instant') {
        concentration = calculator.calculate1D(x, timeForCalculation, simulation.params.M, simulation.params.D);
      } else {
        concentration = calculator.calculate1Dli(x, timeForCalculation, simulation.params.C0, simulation.params.D, simulation.params.h);
      }
    } else if (simulation.dimension === '2D') {
      if (simulation.sourceType === 'instant') {
        concentration = calculator.calculate2D(x, y, timeForCalculation, simulation.params.M, simulation.params.D, simulation.params.D);
      } else {
        concentration = calculator.calculate2Dli(x, y, timeForCalculation, simulation.params.C0, simulation.params.D, simulation.params.h, simulation.params.b);
      }
    } else if (simulation.dimension === '3D') {
      if (simulation.sourceType === 'instant') {
        concentration = calculator.calculate3D(x, y, z, timeForCalculation, simulation.params.M, simulation.params.D, simulation.params.D, simulation.params.D);
      } else {
        concentration = calculator.calculate3Dli(x, y, z, timeForCalculation, simulation.params.C0, simulation.params.D, simulation.params.h, simulation.params.b, simulation.params.c);
      }
    }
  } catch (error) {
    console.error('计算浓度时出错:', error);
    return 0;
  }
  
  return Math.max(0, concentration);
});

// 预警消息
const warningMessages = computed(() => {
  const warnings = [];
  
  // 平均浓度预警
  if (avgConcentration.value > 5) {
    warnings.push('<div class="text-red-400 text-sm flex items-center">平均浓度超标</div>');
  } else if (avgConcentration.value > 2) {
    warnings.push('<div class="text-yellow-400 text-sm flex items-center">平均浓度偏高</div>');
  } else {
    warnings.push('<div class="text-green-400 text-sm flex items-center">浓度在安全范围内</div>');
  }
  
  // 最高浓度预警
  if (maxConcentration.value > 8) {
    warnings.push('<div class="text-red-400 text-sm flex items-center">最高浓度严重超标</div>');
  } else if (maxConcentration.value > 5) {
    warnings.push('<div class="text-yellow-400 text-sm flex items-center">最高浓度偏高</div>');
  } else {
    warnings.push('<div class="text-green-400 text-sm flex items-center">最高浓度正常</div>');
  }
  
  // 系统状态预警
  if (simulation.pollutionSegments.length > simulation.maxSegments * 0.8) {
    warnings.push('<div class="text-yellow-400 text-sm flex items-center">粒子数量接近上限</div>');
  } else {
    warnings.push('<div class="text-green-400 text-sm flex items-center">系统运行正常</div>');
  }
  
  return warnings.join('');
});

/* ==================== 初始化函数 ==================== */

// 初始化画布
const initCanvas = () => {
  if (!simulationCanvas.value) return;
  
  ctx = simulationCanvas.value.getContext('2d');
  
  // 设置画布尺寸
  const resizeCanvas = () => {
    const container = simulationCanvas.value.parentElement;
    simulationCanvas.value.width = container.clientWidth;
    simulationCanvas.value.height = container.clientHeight;
    initRiverPath();
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
};

// 初始化浓度趋势图表
const initConcentrationChart = () => {
  if (!concentrationChart.value) return;
  
  chartInstance = echarts.init(concentrationChart.value);
  
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: '20%'
    },
    xAxis: {
      type: 'category',
      data: simulation.chartCategories,
      axisLine: {
        lineStyle: {
          color: '#64748B'
        }
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 10,
        interval: 'auto',
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#64748B'
        }
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: '#334155'
        }
      }
    },
    series: [{
      data: simulation.chartData,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#06B6D4',
        width: 2
      },
      itemStyle: {
        color: '#06B6D4'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(6, 182, 212, 0.3)'
          }, {
            offset: 1, color: 'rgba(6, 182, 212, 0.1)'
          }]
        }
      }
    }]
  };
  
  chartInstance.setOption(option);
};

// 初始化河道路径
const initRiverPath = () => {
  simulation.riverPath = [];
  const canvasWidth = simulationCanvas.value.width;
  const canvasHeight = simulationCanvas.value.height;
  
  // 创建弯曲的河道路径（正弦波形状）
  const riverCenterY = canvasHeight / 2;
  const amplitude = canvasHeight * 0.1; // 波动幅度
  
  for (let x = 0; x < canvasWidth; x += CONSTANTS.RIVER_PATH_STEP) {
    const y = riverCenterY + Math.sin(x * 0.01) * amplitude;
    simulation.riverPath.push({ x, y });
  }
};

// 初始化污染粒子
const initPollutionSegments = () => {
  simulation.pollutionSegments = [];
  
  const startX = 50; // 河道起点
  const startY = simulation.riverPath[0]?.y || simulationCanvas.value.height / 2;
  const halfRiverWidth = simulation.riverWidth / 2;
  
  // 基础浓度：根据污染源类型设置
  const baseConcentration = simulation.sourceType === 'instant' ? 
    simulation.params.M / 100 : 
    simulation.params.C0 / 10;
  
  // 创建初始粒子分布
  for (let i = 0; i < CONSTANTS.INITIAL_PARTICLES; i++) {
    const xOffset = i * 15 + Math.random() * 10;
    const currentX = startX + xOffset;
    const riverCenterY = getRiverCenterY(currentX);
    
    // 考虑粒子半径，确保不超出河道
    const maxOffset = halfRiverWidth - CONSTANTS.PARTICLE_SIZE / 2;
    const yOffset = (Math.random() - 0.5) * maxOffset * 2 * 0.8;
    
    simulation.pollutionSegments.push({
      x: currentX,
      y: riverCenterY + yOffset,
      vx: 1.0 + Math.random() * 0.3,
      vy: (Math.random() - 0.5) * 0.5,
      size: CONSTANTS.PARTICLE_SIZE, // 固定大小
      concentration: Math.max(0.5, baseConcentration * (1 - i * 0.02) + (Math.random() - 0.5) * 0.5),
      age: 0
    });
  }
};

/* ==================== 辅助工具函数 ==================== */

// 根据x坐标获取河道中心的y坐标（线性插值）
const getRiverCenterY = (x) => {
  if (!simulation.riverPath || simulation.riverPath.length === 0) {
    return simulationCanvas.value?.height / 2 || 0;
  }
  
  // 找到最接近的河道点
  const pathIndex = Math.floor(x / CONSTANTS.RIVER_PATH_STEP);
  if (pathIndex < 0) return simulation.riverPath[0].y;
  if (pathIndex >= simulation.riverPath.length) return simulation.riverPath[simulation.riverPath.length - 1].y;
  
  // 线性插值
  const index1 = Math.min(pathIndex, simulation.riverPath.length - 1);
  const index2 = Math.min(pathIndex + 1, simulation.riverPath.length - 1);
  const point1 = simulation.riverPath[index1];
  const point2 = simulation.riverPath[index2];
  
  if (index1 === index2) return point1.y;
  
  const t = (x - point1.x) / (point2.x - point1.x);
  return point1.y + (point2.y - point1.y) * t;
};

// 获取河道在指定x坐标处的流动方向（归一化向量）
const getRiverDirection = (x) => {
  if (!simulation.riverPath || simulation.riverPath.length < 2) {
    return { dx: 1, dy: 0 }; // 默认水平向右
  }
  
  const pathIndex = Math.floor(x / CONSTANTS.RIVER_PATH_STEP);
  const index1 = Math.max(0, Math.min(pathIndex, simulation.riverPath.length - 2));
  const index2 = index1 + 1;
  
  const point1 = simulation.riverPath[index1];
  const point2 = simulation.riverPath[index2];
  
  // 计算方向向量
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return { dx: 1, dy: 0 };
  
  // 归一化
  return {
    dx: dx / length,
    dy: dy / length
  };
};

// 根据浓度值获取对应的颜色（蓝→红渐变）
const getConcentrationColor = (concentration) => {
  const ratio = Math.min(concentration / 10, 1); // 归一化到0-1
  
  // 颜色渐变分段：蓝 → 青 → 绿 → 黄 → 橙 → 红
  if (ratio < 0.2) {
    // 深蓝 → 青色 (浓度 0-2 mg/L)
    const t = ratio / 0.2;
    return `rgb(${Math.floor(30 + t * 30)}, ${Math.floor(150 + t * 100)}, 255)`;
  } else if (ratio < 0.4) {
    // 青色 → 绿色 (浓度 2-4 mg/L)
    const t = (ratio - 0.2) / 0.2;
    return `rgb(${Math.floor(60 - t * 40)}, ${Math.floor(250 - t * 30)}, ${Math.floor(255 - t * 130)})`;
  } else if (ratio < 0.6) {
    // 绿色 → 黄色 (浓度 4-6 mg/L)
    const t = (ratio - 0.4) / 0.2;
    return `rgb(${Math.floor(20 + t * 235)}, ${Math.floor(220 - t * 10)}, ${Math.floor(125 - t * 85)})`;
  } else if (ratio < 0.8) {
    // 黄色 → 橙色 (浓度 6-8 mg/L)
    const t = (ratio - 0.6) / 0.2;
    return `rgb(255, ${Math.floor(210 - t * 60)}, ${Math.floor(40 - t * 20)})`;
  } else {
    // 橙色 → 深红色 (浓度 8-10+ mg/L)
    const t = (ratio - 0.8) / 0.2;
    return `rgb(${Math.floor(255 - t * 80)}, ${Math.floor(150 - t * 120)}, ${Math.floor(20 - t * 10)})`;
  }
};

/* ==================== 模拟控制函数 ==================== */

// 开始模拟
const startSimulation = () => {
  simulation.isRunning = true;
  if (!simulation.startTime) {
    simulation.startTime = Date.now();
  }
};

// 暂停模拟
const pauseSimulation = () => {
  simulation.isRunning = false;
};

// 重置模拟
const resetSimulation = () => {
  simulation.isRunning = false;
  simulation.currentTime = 0;
  simulation.startTime = Date.now();
  simulation.lastFrameTime = 0;
  simulation.chartData = [];
  simulation.chartCategories = [];
  lastChartUpdate = 0;
  
  // 重新初始化污染粒子
  initPollutionSegments();
  
  // 清空图表
  if (chartInstance) {
    chartInstance.setOption({
      xAxis: { data: [] },
      series: [{ data: [] }]
    });
  }
};

// 反演计算
const calculateInverse = () => {
  try {
    const { C, t, M, D } = simulation.inverseParams;
    
    // 参数验证
    if (C <= 0 || t <= 0 || M <= 0 || D <= 0) {
      alert('请输入有效的参数值（所有参数必须大于0）');
      return;
    }
    
    // 执行反演计算
    const distance = inverseCalculate1D(D, t, C, M);
    
    if (distance === 0) {
      alert('反演计算失败：参数组合不合理。请检查：\n1. 观测浓度是否过高或过低\n2. 时间、质量、扩散系数是否合理');
      simulation.inverseResult = null;
      return;
    }
    
    // 保存结果
    simulation.inverseResult = distance;
    
  } catch (error) {
    console.error('反演计算出错:', error);
    alert('反演计算出错：' + error.message);
    simulation.inverseResult = null;
  }
};


/* ==================== 模拟更新核心函数 ==================== */

// 更新模拟状态（每帧调用）
const updateSimulation = (timestamp) => {
  if (!simulation.lastFrameTime) {
    simulation.lastFrameTime = timestamp;
    return; // 首次运行时不更新
  }
  
  const deltaTime = (timestamp - simulation.lastFrameTime);
  simulation.lastFrameTime = timestamp;
  
  if (simulation.isRunning) {
    // 更新模拟时间
    simulation.currentTime += deltaTime * simulation.speed;
    
    // 两种模式都使用粒子动画
    const halfRiverWidth = simulation.riverWidth / 2;
    const particleRadius = CONSTANTS.PARTICLE_SIZE / 2;
    
    // === 更新每个污染粒子 ===
    simulation.pollutionSegments.forEach(segment => {
      // 1. 获取河道方向和中心位置
      const riverDirection = getRiverDirection(segment.x);
      const riverCenterY = getRiverCenterY(segment.x);
      
      // 2. 粒子沿河道方向流动（使用固定速度）
      const flowSpeed = 2.0 * segment.vx; // 固定水流速度
      segment.x += riverDirection.dx * flowSpeed * 0.5;
      segment.y += riverDirection.dy * flowSpeed * 0.5;
      
      // 3. 计算相对于河道中心的偏移
      let offsetFromCenter = segment.y - riverCenterY;
      
      // 4. 横向扩散运动（垂直于河道方向）
      const diffusionSpeed = simulation.params.D * 0.5; // 使用扩散系数
      segment.vy += (Math.random() - 0.5) * diffusionSpeed * 0.1;
      segment.vy *= 0.98; // 速度阻尼
      offsetFromCenter += segment.vy;
      
      // 5. 限制粒子在河道范围内（考虑粒子半径）
      const maxOffset = halfRiverWidth - particleRadius;
      if (Math.abs(offsetFromCenter) > maxOffset) {
        offsetFromCenter = Math.sign(offsetFromCenter) * maxOffset;
        segment.vy *= -0.5; // 边界反弹
      }
      segment.y = riverCenterY + offsetFromCenter;
      
      // 6. 更新粒子年龄
      segment.age += deltaTime;
      
      // 7. 浓度衰减（基于扩散稀释）
      segment.concentration *= 0.998;
    });
    
    // === 清理过期粒子 ===
    const canvasWidth = simulationCanvas.value.width;
    const canvasHeight = simulationCanvas.value.height;
    simulation.pollutionSegments = simulation.pollutionSegments.filter(
      segment => segment.x < canvasWidth + 200 && 
                 segment.x > -200 &&
                 segment.y > -100 && 
                 segment.y < canvasHeight + 100 && 
                 segment.concentration > CONSTANTS.CONCENTRATION_THRESHOLD
    );
    
    // === 在源头生成新污染粒子 ===
    if (simulation.pollutionSegments.length < CONSTANTS.MAX_PARTICLES) {
      const startX = 50; // 河道起点
      const riverCenterY = getRiverCenterY(startX);
      
      // 基础浓度：根据污染源类型设置
      const baseConcentration = simulation.sourceType === 'instant' ? 
        simulation.params.M / 100 : 
        simulation.params.C0 / 10;
      
      const particlesToAdd = Math.random() < 0.5 ? 2 : 1;
      
      // 考虑粒子半径，确保生成的粒子完全在河道内
      const maxOffset = halfRiverWidth - particleRadius;
      
      for (let i = 0; i < particlesToAdd; i++) {
        const yOffset = (Math.random() - 0.5) * maxOffset * 2 * 0.7;
        
        simulation.pollutionSegments.push({
          x: startX + (Math.random() - 0.5) * 15,
          y: riverCenterY + yOffset,
          vx: 1.0 + Math.random() * 0.3,
          vy: (Math.random() - 0.5) * 0.5,
          size: CONSTANTS.PARTICLE_SIZE, // 固定大小
          concentration: Math.max(0.5, baseConcentration + (Math.random() - 0.5) * baseConcentration * 0.3),
          age: 0
        });
      }
    }
  }
};

/* ==================== 渲染函数 ==================== */

// 渲染模拟画面
const renderSimulation = () => {
  if (!ctx) return;
  
  // 清空画布（轻微拖尾效果让运动更流畅）
  ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
  ctx.fillRect(0, 0, simulationCanvas.value.width, simulationCanvas.value.height);
  
    render2DRiver();
};

// 渲染2D河道和污染粒子
const render2DRiver = () => {
  // === 1. 绘制河流基础 ===
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.lineWidth = simulation.riverWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  simulation.riverPath.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  
  // === 2. 绘制污染粒子 ===
  // 按浓度排序（从低到高），先绘制低浓度的，产生自然叠加效果
  const sortedSegments = [...simulation.pollutionSegments].sort((a, b) => a.concentration - b.concentration);
  
  sortedSegments.forEach(segment => {
    const color = getConcentrationColor(segment.concentration);
    
    // 创建径向渐变，从中心到边缘
    const gradient = ctx.createRadialGradient(
      segment.x, segment.y, 0,
      segment.x, segment.y, segment.size
    );
    
    // 解析RGB颜色
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = matches[0];
      const g = matches[1];
      const b = matches[2];
      
      // 根据浓度调整透明度
      const alpha = Math.min(0.7, segment.concentration / 10);
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = gradient;
      
      // 启用模糊效果
      ctx.shadowBlur = segment.size * 0.5;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, segment.size, 0, Math.PI * 2);
    ctx.fill();
      
      // 重置阴影
    ctx.shadowBlur = 0;
    }
  });
  
  ctx.globalAlpha = 1.0;
  
  // === 3. 绘制污染源和观测点标记 ===
  const canvasWidth = simulationCanvas.value.width;
  const canvasHeight = simulationCanvas.value.height;
  
  // 污染源在河道起点（左侧），坐标系统中为(0,0)
  const sourceX = 50; // 河道起点x坐标
  const sourceY = simulation.riverPath[0]?.y || canvasHeight / 2; // 河道起点y坐标
  
  // 将观测点坐标转换为画布坐标
  // 观测点坐标是相对于污染源的，假设：10像素 = 1米
  const observationCanvasX = sourceX + simulation.observationPoint.x * 10;
  const observationCanvasY = sourceY + simulation.observationPoint.y * 10;
  
  // 绘制污染源标记（河道起点）
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(sourceX, sourceY, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('污染源(0,0)', sourceX + 12, sourceY - 12);
  
  // 绘制观测点标记
  ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(observationCanvasX, observationCanvasY, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.font = 'bold 12px Arial';
  const obsLabel = simulation.dimension === '1D' ? 
    `观测点(${simulation.observationPoint.x}m)` :
    simulation.dimension === '2D' ?
    `观测点(${simulation.observationPoint.x},${simulation.observationPoint.y}m)` :
    `观测点(${simulation.observationPoint.x},${simulation.observationPoint.y},${simulation.observationPoint.z}m)`;
  ctx.fillText(obsLabel, observationCanvasX + 12, observationCanvasY - 12);
  
  // 绘制连线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(sourceX, sourceY);
  ctx.lineTo(observationCanvasX, observationCanvasY);
  ctx.stroke();
  ctx.setLineDash([]);
};

/* ==================== 图表更新函数 ==================== */

// 更新浓度趋势图表（每2秒更新一次）
const updateConcentrationChart = () => {
  if (!chartInstance || !simulation.isRunning) return;
  
  const currentTime = Date.now();
  if (currentTime - lastChartUpdate >= CONSTANTS.CHART_UPDATE_INTERVAL) {
    lastChartUpdate = currentTime;
    
    // 获取当前时间字符串
    const timeString = new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    
    // 限制数据点数量，保持图表清晰
    if (simulation.chartData.length >= CONSTANTS.CHART_MAX_POINTS) {
      simulation.chartData.shift();
      simulation.chartCategories.shift();
    }
    
    // 添加新数据点（观测点浓度）
    const dataValue = parseFloat(observationConcentration.value.toFixed(3));
    simulation.chartData.push(dataValue);
    simulation.chartCategories.push(timeString);
    
    // 更新图表
    chartInstance.setOption({
      xAxis: { data: simulation.chartCategories },
      series: [{ data: simulation.chartData }]
    });
  }
};

/* ==================== 动画循环 ==================== */

// 启动动画循环
const startAnimationLoop = () => {
  const animate = (timestamp) => {
    updateSimulation(timestamp);
    renderSimulation();
    updateConcentrationChart();
    
    animationId = requestAnimationFrame(animate);
  };
  
  animationId = requestAnimationFrame(animate);
};

/* ==================== 生命周期钩子 ==================== */

// 组件挂载时初始化
onMounted(() => {
  simulation.startTime = Date.now();
  
  initCanvas(); // 初始化画布
  initConcentrationChart(); // 初始化图表
  initRiverPath(); // 初始化河道路径
  initPollutionSegments(); // 初始化污染粒子
  startAnimationLoop(); // 开始动画循环
});

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 停止动画
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // 销毁图表实例
  if (chartInstance) {
    chartInstance.dispose();
  }
  
  // 移除事件监听器
  window.removeEventListener('resize', handleResize);
});

/* ==================== 事件处理函数 ==================== */

// 窗口大小变化处理
const handleResize = () => {
  if (simulationCanvas.value) {
    const container = simulationCanvas.value.parentElement;
    simulationCanvas.value.width = container.clientWidth;
    simulationCanvas.value.height = container.clientHeight;
    initRiverPath();
  }
  
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 添加防抖的窗口大小变化监听
window.addEventListener('resize', debounce(handleResize, 250));
</script>

<style scoped>
* {
  font-family: 'Noto Sans SC', sans-serif;
}

body {
  background: linear-gradient(135deg, #0A1628 0%, #0F172A 100%);
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.text-white {
  color: #ffffff;
}

.glass-effect {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.control-panel {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.simulation-canvas {
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.data-card {
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.data-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.15);
}

.slider-container {
  position: relative;
  margin: 1rem 0;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(100, 116, 139, 0.5);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #06B6D4;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
}

.control-button {
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.25rem;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.2);
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
}

.control-button:active {
  transform: translateY(0);
}

.control-button.active {
  background: linear-gradient(135deg, #F59E0B, #D97706);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.concentration-display {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin: 1rem 0;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}

.warning-alert {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #F59E0B;
}

.pollutant-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.river-indicator {
  position: absolute;
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  border-radius: 2px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.flow-indicator {
  position: absolute;
  width: 30px;
  height: 2px;
  background: rgba(6, 182, 212, 0.6);
  animation: flow 1.5s ease-in-out infinite;
}

@keyframes flow {
  0%, 100% { transform: translateX(0px); opacity: 0.6; }
  50% { transform: translateX(10px); opacity: 1; }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.bento-layout {
  display: grid;
  grid-template-columns: 300px 1fr 320px;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  height: calc(100vh - 80px);
  margin-top: 10px;
  padding: 1rem;
  box-sizing: border-box;
}

.header-area {
  grid-column: 1 / -1;
  height: 60px;
}

.control-area {
  grid-column: 1;
  grid-row: 2;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.5) rgba(30, 41, 59, 0.5);
}

.control-area::-webkit-scrollbar {
  width: 8px;
}

.control-area::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 4px;
}

.control-area::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.5);
  border-radius: 4px;
}

.control-area::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.8);
}

.simulation-area {
  grid-column: 2;
  grid-row: 2;
  position: relative;
}

.data-area {
  grid-column: 3;
  grid-row: 2;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.5) rgba(30, 41, 59, 0.5);
}

.data-area::-webkit-scrollbar {
  width: 8px;
}

.data-area::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 4px;
}

.data-area::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.5);
  border-radius: 4px;
}

.data-area::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.8);
}

/* 响应式设计优化 */
@media (max-width: 1280px) {
  .bento-layout {
    grid-template-columns: 280px 1fr 300px;
  }
}

@media (max-width: 1024px) {
  .bento-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    height: auto;
    margin-top: 70px;
    padding: 0.5rem;
  }
  
  .control-area,
  .simulation-area,
  .data-area {
    grid-column: 1;
    grid-row: auto;
    margin-bottom: 1rem;
  }
  
  .simulation-area {
    height: 500px;
  }
  
  .control-panel {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .bento-layout {
    padding: 0.25rem;
  }
  
  .simulation-area {
    height: 400px;
  }
  
  .control-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .concentration-display {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .simulation-area {
    height: 300px;
  }
  
  .control-panel,
  .data-card {
    padding: 0.75rem;
  }
  
  .concentration-display {
    font-size: 1.5rem;
  }
}

/* 添加一些动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.control-panel,
.data-card,
.simulation-canvas {
  animation: fadeIn 0.5s ease-out;
}

/* 优化选择框样式 */
select,
input[type="number"] {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  transition: all 0.3s ease;
}

select:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #06B6D4;
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
}

/* 优化按钮组样式 */
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 优化数据卡片中的文本样式 */
.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.top-4 {
  top: 1rem;
}

.bottom-4 {
  bottom: 1rem;
}

.left-4 {
  left: 1rem;
}

.right-4 {
  right: 1rem;
}

.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.-translate-y-1\/2 {
  --tw-translate-y: -50%;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.text-center {
  text-align: center;
}

.text-gray-300 {
  color: rgba(209, 213, 219, 1);
}

.text-cyan-400 {
  color: rgba(34, 211, 238, 1);
}

.text-red-400 {
  color: rgba(248, 113, 113, 1);
}

.text-green-400 {
  color: rgba(74, 222, 128, 1);
}

.text-yellow-400 {
  color: rgba(250, 204, 21, 1);
}

.text-white {
  color: rgba(255, 255, 255, 1);
}
</style>