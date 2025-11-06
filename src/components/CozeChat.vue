<template>
  <div v-if="isVisible" class="ai-chat-container">
    <div class="ai-chat-wrapper">
      <!-- 头部 -->
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div class="ai-avatar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div class="ai-chat-title-wrapper">
            <h3 class="ai-chat-title">AI 溯源助手</h3>
            <p class="ai-chat-subtitle">Powered by Moonshot AI</p>
          </div>
        </div>
        <button @click="closeChat" class="ai-close-button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 消息列表 -->
      <div ref="messagesContainer" class="ai-messages-container">
        <div v-if="messages.length === 0" class="ai-welcome">
          <div class="ai-welcome-icon">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <h4 class="ai-welcome-title">欢迎使用 AI 溯源助手</h4>
          <p class="ai-welcome-text">我可以帮助您分析水污染模拟数据、解答相关问题</p>
        </div>

        <div v-for="(msg, index) in messages" :key="index" class="ai-message" :class="msg.role">
          <div class="ai-message-avatar">
            <svg v-if="msg.role === 'assistant'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="ai-message-content">
            <div class="ai-message-text" v-html="formatMessage(msg.content)"></div>
            <div class="ai-message-time">{{ msg.timestamp }}</div>
          </div>
        </div>

        <!-- 加载中提示 -->
        <div v-if="isLoading" class="ai-message assistant">
          <div class="ai-message-avatar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div class="ai-message-content">
            <div class="ai-loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="ai-input-area">
        <div class="ai-input-wrapper">
          <textarea
            v-model="userInput"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="addNewLine"
            placeholder="输入您的问题... (Enter 发送，Shift+Enter 换行)"
            class="ai-input"
            rows="1"
            ref="inputRef"
          ></textarea>
          <button 
            @click="sendMessage" 
            class="ai-send-button"
            :disabled="!userInput.trim() || isLoading"
          >
            <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
        <div class="ai-input-tips">
          <span class="ai-tip-item">💡 提示：您可以询问关于水污染扩散、参数优化、结果分析等问题</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  simulationData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible', 'close']);

const isVisible = ref(props.visible);
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);
const inputRef = ref(null);

// Moonshot AI API 配置
// 优先从环境变量读取 API Key，如果没有则使用默认值（需要手动替换）
const MOONSHOT_API_KEY = import.meta.env.VITE_MOONSHOT_API_KEY || 'sk-h9lgXt2uwJVe1xahapvIayJPwawUWhNIzD8XosCHZK0v4cdm';
const MOONSHOT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

// 监听 visible 属性变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
  if (newVal) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

// 格式化消息（支持 Markdown）
const formatMessage = (content) => {
  if (!content) return '';
  
  // 简单的 Markdown 支持
  let formatted = content
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 加粗
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // 换行
    .replace(/\n/g, '<br>');
  
  return formatted;
};

// 发送消息到 Moonshot AI
const sendMessage = async () => {
  const message = userInput.value.trim();
  if (!message || isLoading.value) return;

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: getCurrentTime()
  });

  userInput.value = '';
  isLoading.value = true;

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  try {
    // 准备消息历史
    const messageHistory = messages.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 调用 Moonshot AI API
    const response = await fetch(MOONSHOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOONSHOT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: messageHistory,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // 添加 AI 回复
    messages.value.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: getCurrentTime()
    });

  } catch (error) {
    console.error('发送消息失败:', error);
    
    // 添加错误消息
    messages.value.push({
      role: 'assistant',
      content: `抱歉，发送消息时出现错误：${error.message}。请检查 API Key 配置或网络连接。`,
      timestamp: getCurrentTime()
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

// 发送模拟数据给 AI
const sendSimulationData = async () => {
  const data = props.simulationData;
  
  let message = '请帮我分析以下水污染模拟数据：\n\n';
  
  if (data.calculationType === 'forward') {
    message += `**计算类型**：正演（预测浓度）\n`;
    message += `**维度**：${data.dimension}\n`;
    message += `**污染源类型**：${data.sourceType === 'instant' ? '瞬时源' : '初始有限源'}\n`;
    message += `**模拟时长**：${data.simulationDuration} 秒\n`;
    message += `**观测点位置**：`;
    
    if (data.dimension === '1D') {
      message += `X=${data.observationPoint.x}m\n`;
    } else if (data.dimension === '2D') {
      message += `(${data.observationPoint.x}, ${data.observationPoint.y})m\n`;
    } else {
      message += `(${data.observationPoint.x}, ${data.observationPoint.y}, ${data.observationPoint.z})m\n`;
    }
    
    message += `**观测点浓度**：${data.observationConcentration} mg/L\n`;
    message += `**平均浓度**：${data.avgConcentration} mg/L\n`;
    message += `\n**参数设置**：\n`;
    message += `- 扩散系数 D：${data.params.D} m²/s\n`;
    
    if (data.sourceType === 'instant') {
      message += `- 投放质量 M：${data.params.M} kg\n`;
    } else {
      message += `- 初始浓度 C₀：${data.params.C0} mg/L\n`;
      message += `- 污染源半长 h：${data.params.h} m\n`;
      if (data.dimension !== '1D') {
        message += `- 污染源半宽 b：${data.params.b} m\n`;
      }
      if (data.dimension === '3D') {
        message += `- 污染源半高 c：${data.params.c} m\n`;
      }
    }
  } else {
    message += `**计算类型**：反演（定位污染源）\n`;
    message += `**观测浓度**：${data.inverseParams.C} mg/L\n`;
    message += `**观测时间**：${data.inverseParams.t} 秒\n`;
    message += `**投放质量 M**：${data.inverseParams.M} kg\n`;
    message += `**扩散系数 D**：${data.inverseParams.D} m²/s\n`;
    
    if (data.inverseResult !== null) {
      message += `\n**反演结果**：\n`;
      message += `- 污染源距离：${data.inverseResult} m\n`;
    }
  }

  // 设置用户输入并发送
  userInput.value = message;
  await sendMessage();
};

// 添加换行
const addNewLine = () => {
  userInput.value += '\n';
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// 关闭聊天窗口
const closeChat = () => {
  isVisible.value = false;
  emit('update:visible', false);
  emit('close');
};

// 暴露方法给父组件
defineExpose({
  sendSimulationData
});
</script>

<style scoped>
/* 容器 */
.ai-chat-container {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 450px;
  height: 650px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-chat-wrapper {
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 头部 */
.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15));
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
}

.ai-chat-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.ai-avatar .w-6 {
  width: 1.5rem;
  height: 1.5rem;
}

.ai-chat-title-wrapper {
  display: flex;
  flex-direction: column;
}

.ai-chat-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.2;
}

.ai-chat-subtitle {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 1);
  margin: 0;
  line-height: 1.2;
}

.ai-close-button {
  background: transparent;
  border: none;
  color: rgba(148, 163, 184, 1);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-close-button:hover {
  color: rgba(248, 113, 113, 1);
  background: rgba(248, 113, 113, 0.1);
}

.ai-close-button .w-5 {
  width: 1.25rem;
  height: 1.25rem;
}

/* 消息区域 */
.ai-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.3) rgba(30, 41, 59, 0.3);
}

.ai-messages-container::-webkit-scrollbar {
  width: 6px;
}

.ai-messages-container::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.3);
  border-radius: 3px;
}

.ai-messages-container::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.3);
  border-radius: 3px;
}

.ai-messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.5);
}

/* 欢迎界面 */
.ai-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  height: 100%;
}

.ai-welcome-icon {
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 1.5rem;
}

.ai-welcome-icon .w-16 {
  width: 4rem;
  height: 4rem;
}

.ai-welcome-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
}

.ai-welcome-text {
  font-size: 0.875rem;
  color: rgba(148, 163, 184, 1);
  margin: 0;
  line-height: 1.6;
}

/* 消息气泡 */
.ai-message {
  display: flex;
  gap: 0.75rem;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-message.user {
  flex-direction: row-reverse;
}

.ai-message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-message.assistant .ai-message-avatar {
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  color: white;
}

.ai-message.user .ai-message-avatar {
  background: rgba(100, 116, 139, 0.4);
  color: rgba(148, 163, 184, 1);
}

.ai-message-avatar .w-5 {
  width: 1.25rem;
  height: 1.25rem;
}

.ai-message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ai-message-text {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.6;
  word-wrap: break-word;
  font-size: 0.9rem;
}

.ai-message.assistant .ai-message-text {
  background: rgba(30, 41, 59, 0.8);
  color: white;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.ai-message.user .ai-message-text {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3));
  color: white;
  border: 1px solid rgba(6, 182, 212, 0.4);
}

.ai-message-text :deep(strong) {
  color: rgba(6, 182, 212, 1);
  font-weight: 600;
}

.ai-message-text :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.85em;
  font-family: 'Courier New', monospace;
}

.ai-message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.4);
  padding: 0.75rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.ai-message-text :deep(pre code) {
  background: transparent;
  padding: 0;
}

.ai-message-time {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.7);
  padding: 0 0.25rem;
}

.ai-message.user .ai-message-time {
  text-align: right;
}

/* 加载动画 */
.ai-loading {
  display: flex;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  width: fit-content;
}

.ai-loading span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(6, 182, 212, 0.8);
  animation: bounce 1.4s infinite ease-in-out both;
}

.ai-loading span:nth-child(1) {
  animation-delay: -0.32s;
}

.ai-loading span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.ai-input-area {
  border-top: 1px solid rgba(6, 182, 212, 0.2);
  padding: 1rem 1.5rem;
  background: rgba(15, 23, 42, 0.8);
}

.ai-input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 0.5rem;
}

.ai-input {
  flex: 1;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  line-height: 1.5;
  font-family: inherit;
  transition: all 0.2s ease;
}

.ai-input:focus {
  outline: none;
  border-color: rgba(6, 182, 212, 0.6);
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
}

.ai-input::placeholder {
  color: rgba(148, 163, 184, 0.6);
}

.ai-send-button {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #06B6D4, #3B82F6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.ai-send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
}

.ai-send-button:active:not(:disabled) {
  transform: translateY(0);
}

.ai-send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-send-button .w-5 {
  width: 1.25rem;
  height: 1.25rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ai-input-tips {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-tip-item {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.8);
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-container {
    bottom: 80px;
    right: 10px;
    left: 10px;
    width: auto;
    height: 550px;
    max-height: calc(100vh - 150px);
  }

  .ai-chat-header {
    padding: 0.75rem 1rem;
  }

  .ai-avatar {
    width: 36px;
    height: 36px;
  }

  .ai-messages-container {
    padding: 1rem;
  }

  .ai-input-area {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .ai-chat-container {
    bottom: 70px;
    height: calc(100vh - 140px);
    max-height: 500px;
  }

  .ai-chat-title {
    font-size: 1rem;
  }

  .ai-message-text {
    font-size: 0.875rem;
    padding: 0.625rem 0.875rem;
  }
}
</style>

