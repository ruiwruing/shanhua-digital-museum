# 善化寺 AR 演示模块

## 📋 项目概述

本模块为善化寺数字博物馆提供 **AR（增强现实）体验**，使用 Google Model Viewer 技术，支持：

- ✅ **WebXR**（支持 Android Chrome）
- ✅ **Scene Viewer**（支持 Android Google Play 服务）
- ✅ **Quick Look**（支持 iOS Safari）

## 📂 文件结构

```
ar-demo/
├── index.html                    # AR Demo 主页面（完整UI框架）
├── model-viewer-demo.html        # 原始 Model Viewer 示例
├── exhibit.glb                   # 3D 模型文件（glTF 二进制格式）
├── exhibit_big_metool.json       # 模型元数据
└── README.md                     # 本文档
```

## 🚀 快速开始

### 本地预览

1. **需要 HTTPS 服务**（AR 功能需要安全上下文）
   ```bash
   # 使用 Python 启动本地 HTTPS 服务
   python3 -m http.server 8000
   # 或使用 Node.js http-server
   npx http-server -p 8000
   ```

2. **访问页面**
   - 本地：`https://localhost:8000/ar-demo/index.html`
   - GitHub Pages：`https://{username}.github.io/shanhua-digital-museum/ar-demo/index.html`

### 手机 AR 体验

#### Android
1. 用 **Chrome 浏览器**打开链接
2. 点击卡片上的「查看 AR」按钮
3. 允许摄像头权限
4. 在真实环境中查看 3D 模型

#### iOS
1. 用 **Safari 浏览器**打开链接
2. 点击「查看 AR」
3. 在 Quick Look 中查看模型

## 📦 3D 模型管理

### 当前模型

- **exhibit.glb** (2.6 MB)
  - 格式：glTF 2.0 Binary
  - 顶点数：~1.96M
  - 三角形数：~653K
  - 尺寸：0.83 × 2.00 × 0.73 m

### 添加新模型

1. **准备模型文件**
   ```
   .glb（推荐，网页加载快）或 .gltf
   .usdz（iOS Quick Look 支持）
   ```

2. **优化模型**（可选但推荐）
   ```bash
   # 使用 gltf-pipeline 压缩
   npx gltf-pipeline -i model.gltf -o model-optimized.glb
   ```

3. **上传文件**
   ```
   ar-demo/buddha.glb
   ar-demo/buddha.usdz
   ```

4. **在 index.html 中注册模型**
   ```javascript
   const AR_MODELS = [
     {
       id: 'buddha',
       title: '五方佛',
       era: '辽代',
       location: '大雄宝殿',
       emoji: '🙏',
       desc: '描述文字',
       modelUrl: 'https://raw.githubusercontent.com/.../ar-demo/buddha.glb',
       iOSUrl: 'https://raw.githubusercontent.com/.../ar-demo/buddha.usdz'
     },
     // ... 更多模型
   ];
   ```

## 🎨 UI 定制

### 修改样式

编辑 `index.html` 中的 `:root` CSS 变量：

```css
:root {
  --gold: #d4a853;              /* 主色调 */
  --bg-primary: #0a0e1a;        /* 背景色 */
  --text-primary: rgba(255, 255, 255, 0.95);  /* 文字色 */
}
```

### 修改文物卡片

在 `index.html` 的 `AR_MODELS` 数组中更新：

```javascript
{
  id: 'unique-id',
  title: '文物名称',
  era: '时代',
  location: '位置',
  emoji: '🏯',  // 卡片图标
  desc: '详细描述',
  modelUrl: 'model-url',
  iOSUrl: 'ios-model-url'
}
```

## 🔧 常见问题

### Q1: 为什么看不到 AR 按钮？

**原因**
1. 未通过 HTTPS 访问
2. 浏览器不支持（非 Chrome on Android / Safari on iOS）
3. 设备不支持 AR（过旧的 Android / iOS 版本）

**解决**
- 确保访问 HTTPS 链接
- 在 Android 上使用最新 Chrome
- 在 iOS 上使用最新 Safari

### Q2: 模型加载很慢？

**解决**
1. 压缩模型（使用 gltf-pipeline）
2. 使用 CDN 加速（如 jsDelivr、CDN77）
3. 启用 HTTP/2 和 Gzip 压缩

### Q3: iOS 上模型显示不出来？

**解决**
1. 确保上传了 `.usdz` 文件
2. 检查 `ios-src` URL 是否正确
3. 使用 Safari 而非其他浏览器

### Q4: 如何生成 .usdz 文件？

**方法 1：使用在线工具**
- [Sketchfab Model Converter](https://sketchfab.com/)
- [Three.js GLB to USDZ](https://github.com/google/model-viewer/issues/1419)

**方法 2：使用命令行**
```bash
# 使用 USD 工具（需安装 Pixar USD）
usdcat model.glb -o model.usdz
```

## 📊 性能优化建议

1. **模型优化**
   - 顶点数 < 100K（网页）
   - 纹理 < 2K 分辨率
   - 使用 Draco 压缩

2. **加载优化**
   - 使用 CDN
   - 启用浏览器缓存
   - 预加载关键资源

3. **UI 优化**
   - 离屏加载模型预览
   - 使用图片占位符
   - 流式加载

## 🔗 相关资源

- [Google Model Viewer 文档](https://modelviewer.dev/)
- [glTF 格式规范](https://www.khronos.org/gltf/)
- [WebXR API](https://immersiveweb.org/)
- [Model Viewer GitHub](https://github.com/google/model-viewer)

## 📝 更新日志

### v1.0 (2026-07-20)
- ✅ 基础 AR Demo 框架
- ✅ 四文物卡片（五方佛、藻井、壁画、斗拱）
- ✅ Model Viewer 集成
- ✅ 响应式设计
- ✅ 从主博物馆导航链接

### 待实现
- [ ] 多语言支持
- [ ] AR 标记识别（image target）
- [ ] 3D 模型注解
- [ ] 分享功能
- [ ] 离线模式（PWA）

## 📄 许可

MIT License - 自由使用和修改
