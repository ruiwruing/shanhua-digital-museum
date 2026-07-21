# 善化寺 Digital Museum — 项目交接文档

> 本文档用于新对话中快速恢复项目上下文。

---

## 项目概述

**善化寺数字博物馆**是一个作品集/比赛级的沉浸式数字文博体验项目。

将 Pannellum 全景浏览与现代 UI 结合，打造具有 AI 导览、探索任务、数字叙事和电影级视觉效果的 Web 应用。

---

## 设计风格

| 风格 | 比例 |
|------|------|
| Apple Vision Pro（Glassmorphism） | 65% |
| Vibe Coding（现代交互） | 25% |
| 故宫数字文物（东方美学） | 10% |

**关键词**：Glassmorphism · 深蓝夜色 · 鎏金 · 大圆角 · 微动画 · 极简 · 高级科技感 · 东方文化细节

---

## 项目结构

```text
shanhua-digital-museum/
├── index.html              # 主页面（Landing + Museum 双视图）
├── README.md
│
├── css/
│   ├── style.css           # 主样式（设计系统 + 所有组件）
│   └── animation.css       # 动画样式（呼吸发光、打字机、过渡）
│
├── js/
│   └── app.js              # 核心逻辑（Pannellum、探索任务、AI导游、时间轴、音效）
│
├── assets/
│   ├── landing_bg.jpg      # Landing Page 背景图
│   ├── buddha.jpg          # 五方佛卡片图
│   ├── caisson.jpg         # 藻井卡片图
│   ├── mural.jpg           # 壁画卡片图
│   ├── dougong.jpg         # 斗拱卡片图
│   └── temple_ambient.wav  # 寺庙氛围音效（30秒循环）
│
└── panorama/
    └── shanhua_main.jpg    # 善化寺全景图
```

**独立文件**：
- `shanhua-digital-museum.html` — 所有资源内联的单文件版本，双击即可打开

---

## 技术栈

| 技术 | 说明 |
|------|------|
| HTML5 | 语义化结构 |
| CSS3 | Glassmorphism + CSS Variables + backdrop-filter |
| Vanilla JavaScript | 无框架，纯 JS 实现 |
| Pannellum | 全景浏览引擎（CDN 加载） |
| Python + NumPy + SciPy | 音效合成（钟声、木鱼、风铃、环境音） |
| Python + Pillow | 背景图和文物卡片图生成 |

---

## 功能清单

### Landing Page
- 全景图背景 + 半透明遮罩
- 大字「善化寺」+ 英文副标题
- 金色分割线 + 年代标注
- 透明毛玻璃「开始探索」按钮
- Fade 过渡进入 VR 页面
- 粒子漂浮动画

### VR 博物馆页面
- **全景铺满**：Pannellum 360° 全景，占满整个视口
- **浮动毛玻璃顶栏**（居中胶囊）：Logo + 文化值 + 进度条 + 音效/全屏按钮
- **浮动毛玻璃时间轴**（底部胶囊）：唐→辽→金→明→清→今天，点击切换时代滤镜
- **浮动 FAB 按钮**：左侧探索任务、右侧 AI 导览，点击弹出/收起面板
- **左右毛玻璃面板**：默认收起，展开后可关闭（✕ 按钮）
- **文物卡片**：毛玻璃效果 + 可滚动 + 展开故事

### 探索玩法
- 找到五方佛 / 藻井 / 壁画 / 斗拱
- 点击金色热点 → 完成探索任务 + 增加文化值 + 更新进度
- 完成后 AI 导游自动祝贺

### AI 导游
- 打字机动画输出
- 关键词匹配回复
- 热点联动解说
- 时代切换解说
- 用户输入对话

### 音效系统
- 寺庙氛围音效（钟声 + 木鱼 + 风铃 + 环境底噪）
- 30秒循环播放
- 点击音效按钮开关
- 音量 40%，柔和不突兀

---

## CSS 设计系统

```css
/* 色彩 */
--bg-primary: #0a0e1a;       /* 深蓝夜色 */
--gold: #d4a853;              /* 鎏金主色 */
--gold-light: #e8c878;        /* 金色高光 */
--gold-dark: #b8912e;         /* 金色暗部 */

/* 毛玻璃 */
--glass-bg: rgba(255, 255, 255, 0.06);
--glass-blur: 20px;

/* 圆角 */
--radius-xl: 28px;

/* 字体 */
--font-serif: 'Noto Serif SC', serif;
--font-sans: 'Inter', sans-serif;
```

**面板/顶栏/底栏**：`rgba(255,255,255,0.05~0.06)` + `backdrop-filter: blur(30px) saturate(1.4)` + 半透明白色边框

---

## Pannellum 配置

```javascript
const CONFIG = {
  panorama: {
    source: 'panorama/shanhua_main.jpg',
    type: 'equirectangular',
    autoLoad: true,
    autoRotate: -1,
  },
  hotspots: [
    { id: 'buddha',  yaw: -55, pitch: -8,  label: '五方佛' },
    { id: 'caisson', yaw: 5,   pitch: 55,  label: '藻井'   },
    { id: 'mural',   yaw: 85,  pitch: 2,   label: '壁画'   },
    { id: 'dougong', yaw: -25, pitch: 32,  label: '斗拱'   },
  ],
};
```

> **注意**：热点 yaw/pitch 坐标基于当前全景图调整，更换全景图后需重新校准。

---

## 时代滤镜

| 时代 | CSS Filter | 效果 |
|------|-----------|------|
| 唐 | `sepia(0.4) brightness(0.7) saturate(0.6)` | 古旧暖调 |
| 辽 | `sepia(0.15) brightness(0.85)` | 微暖 |
| 金 | `brightness(0.9) hue-rotate(-5deg)` | 偏冷 |
| 明 | `brightness(0.95) saturate(1.05)` | 中性 |
| 清 | `brightness(1.0) saturate(1.1)` | 明亮 |
| 今天 | `brightness(1.05) saturate(1.15)` | 鲜艳 |

---

## 部署方式

### 本地预览
双击 `shanhua-digital-museum.html` 即可打开（所有资源已内联）。

### GitHub Pages
1. 将 zip 解压到仓库根目录
2. 推送至 GitHub
3. Settings → Pages → Deploy from main branch
4. 访问 `https://{username}.github.io/shanhua-digital-museum/`

### VS Code Live Server
1. 解压项目文件夹
2. 安装 Live Server 插件
3. 右键 `index.html` → Open with Live Server

> ⚠️ 不要直接 `file://` 打开 `index.html`，Pannellum 需要 HTTP 服务。standalone 版本无此限制。

---

## 待优化方向（第二/三/四阶段）

### 第二阶段
- [ ] 接入真实 AI API（OpenAI / 通义千问），替代关键词匹配
- [ ] 更丰富的探索任务逻辑（积分等级、成就系统）
- [ ] 热点高级特效（点击后镜头飞行动画）

### 第三阶段
- [ ] GSAP 动画引擎集成
- [ ] 文物 3D 模型展示（Three.js）
- [ ] 多全景图场景切换（山门→三圣殿→大雄宝殿）
- [ ] UI 响应式优化（移动端适配）

### 第四阶段
- [ ] AI 导游语音输出（TTS）
- [ ] 文物故事深度内容
- [ ] 时间轴动画（年代切换时的过渡效果）
- [ ] 更多环境音效（不同时代不同音效）
- [ ] 社交分享功能
- [ ] PWA 离线支持

---

## 注意事项

1. **保留 Pannellum**：只重写 UI，不替换全景引擎。
2. **不做普通 VR 浏览器**：而是 Digital Museum 体验。
3. **UI 接近 Apple Vision Pro**：毛玻璃、大圆角、极简。
4. **东方美学细节**：鎏金点缀、宋代衬线字体。
5. **音效文件**：`temple_ambient.wav` 由 Python 合成，如需更真实的音效可替换为录音文件。
6. **全景图**：当前为善化寺大殿内部全景，后续可替换为 16K multires 版本。
7. **热点坐标**：更换全景图后需要重新校准 yaw/pitch。

---

## 文件清单

| 文件 | 用途 |
|------|------|
| `shanhua-digital-museum.zip` | 项目完整包（部署 GitHub Pages） |
| `shanhua-digital-museum.html` | 独立单文件版（本地双击预览） |
