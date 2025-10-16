<template>
  <div class="home-container">
    <!-- Navigation -->
    <nav class="navbar glass-effect">
      <div class="container">
        <div class="navbar-content">
          <div class="navbar-brand">
            <div class="tech-icon">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <span class="brand-name gradient-text">水污染监测系统</span>
          </div>
          <div class="navbar-menu">
            <a href="#home" class="nav-link">首页</a>
            <a href="#features" class="nav-link">功能特色</a>
            <a href="#technology" class="nav-link">技术亮点</a>
            <router-link to="/simulation" class="nav-link nav-link-active">开始模拟</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
      <div class="particle-container" ref="particlesContainer"></div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">智能水污染</span><br>
              <span>扩散监测系统</span>
            </h1>
            <p class="hero-description">
              基于先进的环境科学模型和人工智能技术，实时监测和预测水体污染物扩散过程，
              为环境保护和应急响应提供科学依据和决策支持。
            </p>
            <div class="hero-buttons">
              <router-link to="/simulation" class="btn btn-primary">
                开始模拟体验
              </router-link>
              <a href="#features" class="btn btn-outline">
                了解功能
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title gradient-text">核心功能特色</h2>
          <p class="section-description">
            集成先进的环境监测技术，提供全方位的水污染扩散分析和预测功能
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="feature-title">实时扩散模拟</h3>
            <p class="feature-description">
              基于物理引擎的高精度污染物扩散模拟，支持2D和3D视图切换，
              实时展现污染物在水体中的迁移和扩散过程。
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="feature-title">智能参数配置</h3>
            <p class="feature-description">
              灵活的参数调节系统，支持污染物强度、河道特性、环境条件等多维度配置，
              为不同场景提供精准的模拟环境。
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 class="feature-title">数据分析可视化</h3>
            <p class="feature-description">
              强大的数据可视化引擎，提供浓度热力图、趋势分析图表、
              实时数据监控等多种可视化展示方式。
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="feature-title">交互式操作</h3>
            <p class="feature-description">
              直观的交互式界面设计，支持播放控制、视角切换、
              参数实时调节等丰富的操作功能。
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="feature-title">预警系统</h3>
            <p class="feature-description">
              智能预警机制，根据污染物浓度阈值自动触发警报，
              为环境应急响应提供及时的决策支持。
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="feature-title">科学决策支持</h3>
            <p class="feature-description">
              基于环境科学理论和实际监测数据，为环境管理部门
              提供科学、准确的决策支持信息。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section id="technology" class="technology-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title gradient-text">技术架构亮点</h2>
          <p class="section-description">
            采用前沿的Web技术和科学计算模型，构建高性能、高可靠性的环境监测平台
          </p>
        </div>
        
        <div class="technology-content">
          <div class="tech-list">
            <div class="tech-item">
              <div class="tech-number">1</div>
              <div class="tech-info">
                <h3 class="tech-title">Vue3 + TypeScript 架构</h3>
                <p class="tech-description">采用最新的前端框架技术，提供优秀的开发体验和运行时性能。</p>
              </div>
            </div>
            
            <div class="tech-item">
              <div class="tech-number">2</div>
              <div class="tech-info">
                <h3 class="tech-title">物理引擎模拟</h3>
                <p class="tech-description">基于Matter.js物理引擎，实现真实的污染物扩散物理过程模拟。</p>
              </div>
            </div>
            
            <div class="tech-item">
              <div class="tech-number">3</div>
              <div class="tech-info">
                <h3 class="tech-title">高性能图形渲染</h3>
                <p class="tech-description">使用PIXI.js和WebGL技术，确保流畅的动画效果和图形渲染性能。</p>
              </div>
            </div>
            
            <div class="tech-item">
              <div class="tech-number">4</div>
              <div class="tech-info">
                <h3 class="tech-title">科学计算模型</h3>
                <p class="tech-description">集成环境科学理论模型，确保模拟结果的科学性和准确性。</p>
              </div>
            </div>
          </div>
          
          <div class="tech-chart glass-effect">
            <div ref="techChart" class="chart-container"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">开始体验智能监测</h2>
          <p class="cta-description">
            立即进入水污染扩散模拟系统，体验先进的环境监测技术
          </p>
          <router-link to="/simulation" class="btn btn-light">
            进入模拟系统
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p class="footer-text">© 2024 水污染扩散监测系统. 致力于环境保护科技创新.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

// 粒子背景初始化
const particlesContainer = ref(null);
const techChart = ref(null);

onMounted(() => {
  // 初始化粒子背景
  if (typeof p5 !== 'undefined') {
    initParticleBackground();
  }
  
  // 初始化技术图表
  if (typeof echarts !== 'undefined') {
    initTechChart();
  }
  
  // 页面加载动画
  initPageAnimations();
  
  // 平滑滚动
  initSmoothScrolling();
});

onUnmounted(() => {
  // 清理资源
  if (techChart.value) {
    const chart = echarts.getInstanceByDom(techChart.value);
    if (chart) {
      chart.dispose();
    }
  }
});

// 粒子背景初始化
function initParticleBackground() {
  if (!particlesContainer.value) return;
  
  new p5(function(p) {
    let particles = [];
    
    p.setup = function() {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      canvas.parent(particlesContainer.value);
      
      // 创建粒子
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5),
          size: p.random(2, 6),
          alpha: p.random(0.3, 0.8)
        });
      }
    };
    
    p.draw = function() {
      p.clear();
      
      // 绘制粒子
      particles.forEach(particle => {
        p.fill(6, 182, 212, particle.alpha * 255);
        p.noStroke();
        p.ellipse(particle.x, particle.y, particle.size);
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界检查
        if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
      });
    };
    
    p.windowResized = function() {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  });
}

// 技术图表初始化
function initTechChart() {
  if (!techChart.value) return;
  
  const chart = echarts.init(techChart.value);
  
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '系统性能指标',
      textStyle: {
        color: '#06B6D4',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      borderColor: '#06B6D4',
      textStyle: {
        color: '#ffffff'
      }
    },
    legend: {
      data: ['模拟精度', '响应速度', '数据处理能力'],
      textStyle: {
        color: '#ffffff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: {
        lineStyle: {
          color: '#64748B'
        }
      },
      axisLabel: {
        color: '#94A3B8'
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
        color: '#94A3B8'
      },
      splitLine: {
        lineStyle: {
          color: '#334155'
        }
      }
    },
    series: [
      {
        name: '模拟精度',
        type: 'line',
        stack: 'Total',
        data: [95, 96, 97, 98, 99, 99.5],
        lineStyle: {
          color: '#06B6D4'
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
      },
      {
        name: '响应速度',
        type: 'line',
        stack: 'Total',
        data: [88, 90, 92, 94, 96, 98],
        lineStyle: {
          color: '#3B82F6'
        },
        itemStyle: {
          color: '#3B82F6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(59, 130, 246, 0.3)'
            }, {
              offset: 1, color: 'rgba(59, 130, 246, 0.1)'
            }]
          }
        }
      },
      {
        name: '数据处理能力',
        type: 'line',
        stack: 'Total',
        data: [85, 87, 89, 91, 93, 95],
        lineStyle: {
          color: '#10B981'
        },
        itemStyle: {
          color: '#10B981'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(16, 185, 129, 0.3)'
            }, {
              offset: 1, color: 'rgba(16, 185, 129, 0.1)'
            }]
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应式调整
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

// 页面动画初始化
function initPageAnimations() {
  // 使用CSS动画替代anime.js，避免版本兼容性问题
  const elements = document.querySelectorAll('.feature-card');
  
  // 添加动画类
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
  
  // 滚动触发动画
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  document.querySelectorAll('.tech-item').forEach(item => {
    observer.observe(item);
  });
}

// 平滑滚动
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
</script>

<style scoped>
/* 重置样式 */
.home-container {
  font-family: 'Noto Sans SC', sans-serif;
  color: #ffffff;
  overflow-x: hidden;
  background: linear-gradient(135deg, #0A1628 0%, #0F172A 100%);
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (min-width: 640px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
  }
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  padding: 16px 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  transition: all 0.3s ease;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.tech-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.brand-name {
  font-size: 20px;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 24px;
}

.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: #e2e8f0;
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #06B6D4;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #06B6D4;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link-active {
  background: #06B6D4;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}

.nav-link-active:hover {
  color: white;
}

.nav-link-active::after {
  display: none;
}

/* 英雄区域样式 */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  background: url('../resources/hero-bg.jpg') center/cover;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 22, 40, 0.8);
}

.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding-top: 80px;
}

.hero-text {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 56px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 24px;
  animation: float 6s ease-in-out infinite;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 72px;
  }
}

.hero-description {
  font-size: 20px;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .hero-description {
    font-size: 24px;
  }
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
}

/* 按钮样式 */
.btn {
  display: inline-block;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: #06B6D4;
  color: white;
  box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
}

.btn-primary:hover {
  background: #0891b2;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
}

.btn-outline {
  border: 2px solid #06B6D4;
  color: #06B6D4;
}

.btn-outline:hover {
  background: #06B6D4;
  color: white;
  transform: translateY(-2px);
}

.btn-light {
  background: white;
  color: #06B6D4;
}

.btn-light:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

/* 功能区域样式 */
.features-section {
  padding: 80px 0;
  background: linear-gradient(to bottom, #0f172a, #1e293b);
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 48px;
  }
}

.section-description {
  font-size: 20px;
  color: #cbd5e1;
  max-width: 800px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #06B6D4;
}

.feature-description {
  font-size: 16px;
  color: #cbd5e1;
  line-height: 1.6;
}

/* 技术区域样式 */
.technology-section {
  padding: 80px 0;
  background: #1e293b;
}

.technology-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

@media (min-width: 1024px) {
  .technology-content {
    grid-template-columns: 1fr 1fr;
  }
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tech-item {
  display: flex;
  gap: 16px;
  opacity: 0;
  transform: translateY(20px);
}

.tech-number {
  width: 40px;
  height: 40px;
  background: #06B6D4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.tech-info {
  flex: 1;
}

.tech-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #06B6D4;
}

.tech-description {
  font-size: 16px;
  color: #cbd5e1;
  line-height: 1.6;
}

.tech-chart {
  border-radius: 16px;
  padding: 24px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.chart-container {
  height: 400px;
}

/* CTA区域样式 */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(to right, #0c4a6e, #1e3a8a);
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .cta-title {
    font-size: 48px;
  }
}

.cta-description {
  font-size: 20px;
  color: #e2e8f0;
  margin-bottom: 32px;
}

/* 页脚样式 */
.footer {
  padding: 32px 0;
  background: #0f172a;
}

.footer-content {
  text-align: center;
}

.footer-text {
  font-size: 16px;
  color: #94a3b8;
}

/* 通用样式 */
.gradient-text {
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.2);
}

/* 动画效果 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 响应式导航菜单 */
@media (max-width: 767px) {
  .navbar-menu {
    display: none;
  }
}
</style>