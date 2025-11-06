# AI 助手配置说明

本项目使用 Moonshot AI（月之暗面）提供的 Kimi API 作为 AI 助手的后端服务。

## 配置步骤

### 1. 获取 Moonshot AI API Key

1. 访问 [Moonshot AI 开放平台](https://platform.moonshot.cn/)
2. 注册或登录您的账号
3. 在控制台中创建 API Key
4. 复制您的 API Key（格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

### 2. 配置 API Key

打开文件 `src/components/CozeChat.vue`，找到第 126 行：

```javascript
const MOONSHOT_API_KEY = 'sk-your-api-key-here'; // 请替换为您的 Moonshot API Key
```

将 `'sk-your-api-key-here'` 替换为您实际的 API Key。

**重要提示**：
- ⚠️ 请勿将包含真实 API Key 的代码提交到公共代码仓库
- 建议使用环境变量或配置文件来管理 API Key
- 可以创建 `.env.local` 文件存储敏感信息

### 3. 使用环境变量（推荐）

如果您想使用环境变量管理 API Key，可以按以下步骤操作：

#### 3.1 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```env
VITE_MOONSHOT_API_KEY=sk-your-actual-api-key-here
```

#### 3.2 修改代码

在 `src/components/CozeChat.vue` 中修改：

```javascript
// 改为从环境变量读取
const MOONSHOT_API_KEY = import.meta.env.VITE_MOONSHOT_API_KEY || 'sk-your-api-key-here';
```

#### 3.3 添加到 .gitignore

确保 `.env.local` 已添加到 `.gitignore` 文件中：

```
.env.local
```

## Moonshot AI API 说明

### 可用模型

- `moonshot-v1-8k`：8K 上下文窗口
- `moonshot-v1-32k`：32K 上下文窗口
- `moonshot-v1-128k`：128K 上下文窗口
- `kimi-k2-turbo-preview`：最新 Kimi K2 模型（当前使用）

### API 参数说明

在代码中可以调整以下参数：

```javascript
{
  model: 'kimi-k2-turbo-preview', // 使用的模型
  messages: messageHistory,       // 对话历史（包含系统提示词）
  temperature: 0.7,               // 温度（0-1，越高越随机）
  max_tokens: 2000,               // 最大回复长度
  stream: false                   // 是否使用流式输出
}
```

### AI 专家设置

本系统配置了专业的系统提示词，AI 助手被设定为"水污染扩散分析专家"，具备：

- **专业能力**：精通一维、二维、三维污染物扩散模型
- **数学建模**：熟悉污染物扩散的数学方程
- **数据分析**：能够分析模拟数据，识别污染趋势
- **溯源分析**：擅长反演计算，定位污染源
- **环境评估**：能够评估污染影响，提供防治建议

### 消息管理

- **历史消息限制**：系统自动保留最近 20 条消息发送给 API
- **完整历史显示**：用户界面仍显示完整对话历史
- **系统提示词**：每次 API 调用都会附带专家身份设定

如需修改这些设置，请编辑 `src/components/CozeChat.vue` 文件中的以下常量：

```javascript
const MAX_MESSAGES = 20;  // 修改历史消息限制
const SYSTEM_PROMPT = {   // 修改系统提示词
  role: 'system',
  content: '...'
};
```

### 价格说明

请参考 [Moonshot AI 定价页面](https://platform.moonshot.cn/docs/pricing) 了解最新价格。

## 功能特性

### 支持的消息格式

AI 助手支持以下 Markdown 格式：

- **加粗文本**：使用 `**文本**`
- *斜体文本*：使用 `*文本*`
- `行内代码`：使用 `` `代码` ``
- 代码块：使用三个反引号

### 快捷键

- `Enter`：发送消息
- `Shift + Enter`：换行

### 自动功能

- 自动导入模拟数据
- 自动滚动到最新消息
- 消息历史记录保持
- 实时加载状态显示

## 故障排除

### 1. API 请求失败

- 检查 API Key 是否正确
- 确认网络连接正常
- 检查 API 额度是否充足

### 2. 无法显示 AI 响应

- 打开浏览器控制台查看错误信息
- 检查 API 返回的状态码
- 验证消息格式是否正确

### 3. CORS 错误

Moonshot AI API 支持跨域请求，如果遇到 CORS 错误：
- 检查 API URL 是否正确
- 确认 API Key 的权限设置

## 技术支持

- Moonshot AI 文档：https://platform.moonshot.cn/docs
- Moonshot AI 社区：https://forum.moonshot.cn/

## 安全建议

1. ✅ 使用环境变量存储 API Key
2. ✅ 不要在代码中硬编码敏感信息
3. ✅ 定期轮换 API Key
4. ✅ 监控 API 使用量
5. ✅ 设置合理的请求限制

